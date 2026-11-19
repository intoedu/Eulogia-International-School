(function () {
  var results = window.EULOGIA_RESULTS || [];
  var aidCase = window.EULOGIA_AID_CASE || null;
  var growth = window.EULOGIA_GROWTH || [];
  var cohorts = window.EULOGIA_COHORTS || [];
  var calendar = window.EULOGIA_CALENDAR || [];
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* 화면 표시용: 끊기면 안 되는 말을 붙여 씀 (검색용 데이터는 그대로) */
  function nb(s) {
    return String(s == null ? "" : s)
      .replace(/텍사스 A&M/g, "텍사스 A&M")
      .replace(/블린 칼리지/g, "블린 칼리지")
      .replace(/최대 (\d)/g, "최대 $1")
      .replace(/Dual Credit/g, "Dual Credit")
      .replace(/텍사스 현지 고교/g, "텍사스 현지 고교");
  }
  /* 영어판(/en/): <html lang="en"> 이면 화면 글자를 영어로 */
  var EN = /^en/i.test(document.documentElement.lang || "");
  var BASE = EN ? "../" : "";   /* 영어판은 /en/ 폴더 안에 있어 사진 경로가 한 단계 위 */
  var EN_WORDS = {
    "치앙마이 · 유아반 교실": "Chiang Mai · Early Years classroom", "치앙마이 · Eulogia Vision Center": "Chiang Mai · Eulogia Vision Center",
    "치앙마이 · 유아반 독서 공간": "Chiang Mai · Early Years reading corner", "치앙마이 · 유아반 음악실": "Chiang Mai · Early Years music room",
    "전액 장학금": "Full scholarship", "졸업": "Graduated", "석사 과정": "Master's program",
    "Honors · 퍼블릭 아이비": "Honors · Public Ivy", "Honors · 장학금 70%": "Honors · 70% scholarship",
    "졸업 · 미국 조지아 한화 취업": "Graduated · now at Hanwha, Georgia (USA)",
    "전액 장학금 · 기숙사 · 생활비": "Full scholarship · housing · living allowance",
    "장학금 90% + CMSF": "90% + CMSF scholarship", "장학금 90% · 졸업": "90% scholarship · Graduated",
    "마카오": "Macau", "카타르": "Qatar", "두바이": "Dubai", "베트남": "Vietnam", "싱가포르": "Singapore",
    "방콕": "Bangkok", "성균관대학교": "Seoul", "인천 송도": "Songdo, Incheon",
    "최대 75%": "Up to 75%", "Corps of Cadets 장학금": "Corps of Cadets scholarship",
    "텍사스 주립대 (영문 명칭 확인 필요)": "Texas State University"
  };
  function tr(s) {
    if (!EN || s == null) return s;
    if (EN_WORDS[s]) return EN_WORDS[s];
    var m = /^장학금 ([\d$,%]+)$/.exec(s);
    if (m) return m[1] + " scholarship";
    return s;
  }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  var money = function (n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  /* 장학금 받은 대학 먼저, 그다음 합격 인원 순 */
  var ranked = results.slice().sort(function (a, b) {
    var sa = a.scholarship ? 1 : 0, sb = b.scholarship ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return (b.count || 0) - (a.count || 0);
  });
  var total = results.reduce(function (t, r) { return t + (r.count || 0); }, 0);

  /* 1. 첫 화면 사진: 파일이 없거나 1.3배 넘게 늘어나는 사진은 뺌 */
  var slidesEl = document.getElementById("slides");
  var dotsEl = document.getElementById("slide-dots");
  var capEl = document.getElementById("slide-cap");
  var photoBox = document.querySelector(".hero-photo");
  var wanted = window.EULOGIA_SLIDES || [];
  if (dotsEl) dotsEl.hidden = true;
  if (slidesEl && photoBox && wanted.length) {
    var loaded = [], checked = 0, eligibleKey = "", cur = 0, timer = null, active = [];
    var scaleOf = function (r) {
      var b = photoBox.getBoundingClientRect();
      return Math.max(b.width / r.nw, b.height / r.nh);
    };
    var stopPlay = function () { clearInterval(timer); timer = null; };
    var build = function () {
      loaded.sort(function (a, b) { return a.i - b.i; });
      var ok = loaded.filter(function (r) { return scaleOf(r) <= 1.30; });
      var key = ok.map(function (r) { return r.i; }).join(",");
      if (key === eligibleKey) {
        /* 같은 사진들: Ken Burns 여부만 다시 확인 */
        slidesEl.querySelectorAll(".slide").forEach(function (im, n) {
          if (active[n]) im.classList.toggle("kb", !reduceMotion && scaleOf(active[n]) <= 1.10);
        });
        return;
      }
      eligibleKey = key;
      var prevSrc = active[cur] ? active[cur].src : null;
      stopPlay();
      active = ok;
      if (ok.length < 2) {
        /* 사진이 1장뿐이면 처음 건물 사진을 그대로 두고 점은 숨김 */
        var first = ok[0] || { src: BASE + "assets/img/k-classroom.jpg", pos: "50% 60%", place: capEl ? capEl.textContent : "" };
        slidesEl.innerHTML = '<img class="slide on" src="' + esc(first.src) + '" alt="" style="object-position:' + esc(first.pos || "50% 50%") + '">';
        if (capEl && first.place) capEl.textContent = first.place;
        dotsEl.hidden = true;
        dotsEl.innerHTML = "";
        active = ok.slice(0, 1);
        cur = 0;
        play = function () {};
        return;
      }
      cur = 0;
      ok.forEach(function (r, k) { if (r.src === prevSrc) cur = k; });
      slidesEl.innerHTML = ok.map(function (r, k) {
        var kb = !reduceMotion && scaleOf(r) <= 1.10;
        return '<img class="slide' + (kb ? " kb" : "") + (k === cur ? " on" : "") + '" src="' + esc(r.src) + '" alt="" width="' + r.nw + '" height="' + r.nh + '" style="object-position:' + esc(r.pos || "50% 50%") + '">';
      }).join("");
      dotsEl.innerHTML = ok.map(function (r, k) {
        return '<button type="button" aria-label="' + esc(r.place) + '"' + (k === cur ? ' aria-current="true"' : "") + "></button>";
      }).join("");
      dotsEl.hidden = false;
      var imgs = slidesEl.querySelectorAll(".slide");
      var dots = dotsEl.querySelectorAll("button");
      var show = function (k) {
        cur = (k + ok.length) % ok.length;
        imgs.forEach(function (im, n) { im.classList.toggle("on", n === cur); });
        dots.forEach(function (d, n) { if (n === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
        if (capEl) capEl.textContent = ok[cur].place;
      };
      dots.forEach(function (d, n) { d.addEventListener("click", function () { show(n); play(); }); });
      if (capEl) capEl.textContent = ok[cur].place;
      play = function () {
        stopPlay();
        if (!reduceMotion && !document.hidden) timer = setInterval(function () { show(cur + 1); }, 5500);
      };
      play();
    };
    var play = function () {};
    var done = function () { if (++checked === wanted.length) build(); };
    wanted.forEach(function (w, i) {
      var im = new Image();
      var src = BASE + w.src;
      im.onload = function () { loaded.push({ i: i, src: src, place: tr(w.place), pos: w.pos, nw: im.naturalWidth, nh: im.naturalHeight }); done(); };
      im.onerror = done;
      im.src = src;
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) stopPlay(); else play(); });
    window.addEventListener("resize", debounce(function () { if (checked === wanted.length) build(); }, 300));
  }

  /* 2. 합격 대학 벽: 장학금 대학 크게, 다음 4곳 카드, 나머지 목록 */
  var unisEl = document.getElementById("unis");
  var listEl = document.getElementById("uni-chips");
  if (ranked.length) {
    var color = function (r) { return esc(r.color || "#283090"); };
    var featureCard = function (r) {
      var fig = (r.scholarship || "").replace(/^최대\s*/, "");
      return '<li class="uni feature" style="--c:' + color(r) + '">' +
        '<span class="mono" aria-hidden="true">' + esc(r.abbr || "") + "</span>" +
        '<span class="uni-body"><b lang="en">' + esc(r.university) + "</b>" +
        '<span class="uni-ko">' + esc(nb(r.ko)) + " · " + esc(r.state) + "</span></span>" +
        (fig ? '<span class="uni-sch"><span class="sch-fig"><small>최대</small><b>' + esc(fig) + "</b></span>" +
          (r.note ? '<span class="sch-note">' + esc(r.note) + "</span>" : "") + "</span>" : "") +
        '<span class="uni-n">합격</span>' +
        "</li>";
    };
    var tile = function (r) {
      return '<li class="uni" style="--c:' + color(r) + '">' +
        '<span class="mono" aria-hidden="true">' + esc(r.abbr || "") + "</span>" +
        '<span class="uni-body"><b lang="en">' + esc(r.university) + "</b>" +
        '<span class="uni-ko">' + (EN ? "" : esc(nb(r.ko)) + " · ") + esc(r.state) + "</span></span>" +
        '<span class="uni-n">' + (EN ? "Admitted" : "합격") + "</span>" +
        "</li>";
    };
    /* 텍사스 A&M은 율로기아 졸업생 목록에 함께 표시하므로 여기서는 뺌 */
    var rest = ranked.filter(function (r) { return !/^Texas A&M/.test(r.university); });
    if (unisEl) unisEl.innerHTML = rest.slice(0, 4).map(tile).join("");
    var others = rest.slice(4);
    if (listEl) listEl.innerHTML = others.map(function (r) {
      return '<li style="--c:' + color(r) + '"><i aria-hidden="true"></i>' +
        '<span class="nm"' + (r.check && !EN ? "" : ' lang="en"') + ">" + esc(tr(r.university)) +
        (r.check ? ' <span class="tag-sample">' + (EN ? "Name TBC" : "명칭 확인") + "</span>" : "") + "</span>" +
        "</li>";
    }).join("");
    setText("uni-rest-n", others.length);
    /* 율로기아 졸업생 진학: 누적 기록과 따로 */
    var own = window.EULOGIA_OWN || [];
    var ownEl = document.getElementById("own"), board = document.getElementById("own-board");
    if (ownEl && board && own.length) {
      var nUni = 0, nFull = 0;
      board.innerHTML = own.map(function (g) {
        nUni += g.schools.length;
        return '<section class="ob' + (g.wide ? " ob-wide" : "") + '" aria-label="' + esc(g.region) + '">' +
          '<h4><span lang="en">' + esc(g.en) + "</span>" + (EN ? "" : "<small>" + esc(g.region) + "</small>") + "</h4><ul>" +
          g.schools.map(function (u, k) {
            if (u.tag && u.tag.indexOf("전액") === 0) nFull++;
            var cls = (u.key ? "key" : "") + (g.wide && k >= 10 ? " more" : "");
            return "<li" + (cls.trim() ? ' class="' + cls.trim() + '"' : "") + '><span class="ob-nm" lang="en">' + esc(u.name) + "</span>" +
              (u.place ? '<span class="ob-pl">' + esc(tr(u.place)) + "</span>" : "") +
              (u.tag ? '<span class="ob-tag">' + esc(tr(u.tag)) + "</span>" : "") + "</li>";
          }).join("") + "</ul>" +
          (g.wide && g.schools.length > 10 ? '<button type="button" class="ob-more" aria-expanded="false">' + (EN ? "Show " + (g.schools.length - 10) + " more" : esc(g.region) + " 대학 " + (g.schools.length - 10) + "곳 더 보기") + "</button>" : "") +
          "</section>";
      }).join("");
      board.querySelectorAll(".ob-more").forEach(function (btn) {
        var label = btn.textContent;
        btn.addEventListener("click", function () {
          var open = btn.closest(".ob").classList.toggle("open");
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          btn.textContent = open ? (EN ? "Show less" : "접기") : label;
        });
      });
      setText("wall-unis", nUni);
      setText("own-n-reg", own.length);
      setText("own-n-full", nFull);
      ownEl.hidden = false;
    }
    setText("summary-meta", results.length + (EN ? " universities" : "곳"));
  }

  /* 진학 실적 펼치기: #results 로 가는 링크, 주소의 #results */
  var resDetails = document.getElementById("results");
  var openResults = function (scroll) {
    if (!resDetails) return;
    resDetails.open = true;
    if (scroll) resDetails.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  document.querySelectorAll('a[href="#results"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openResults(true);
      if (history.replaceState) history.replaceState(null, "", "#results");
    });
  });
  if (location.hash === "#results") { openResults(false); setTimeout(function () { openResults(true); }, 60); }
  window.addEventListener("hashchange", function () { if (location.hash === "#results") openResults(true); });

  /* 진학 실적 표: 검색 + 주 선택 */
  var stateSel = document.getElementById("res-state");
  var query = document.getElementById("res-q");
  var tbody = document.getElementById("res-body");
  var summary = document.getElementById("res-summary");
  if (stateSel) {
    results.map(function (r) { return r.state; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().forEach(function (st) {
      var o = document.createElement("option"); o.value = st; o.textContent = st; stateSel.appendChild(o);
    });
  }
  function renderResults() {
    if (!tbody) return;
    var st = stateSel ? stateSel.value : "";
    var q = query ? query.value.trim().toLowerCase() : "";
    var rows = ranked.filter(function (r) {
      if (st && r.state !== st) return false;
      if (!q) return true;
      return [r.university, r.ko, r.state, r.note].join(" ").toLowerCase().indexOf(q) !== -1;
    });
    if (!rows.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="3" class="empty">' + (EN ? "No universities match. Try another search or state." : "조건에 맞는 대학이 없습니다. 검색어나 주를 바꿔 보세요.") + '</td></tr>';
    } else {
      tbody.innerHTML = rows.map(function (r) {
        var sch = r.scholarship ? '<span class="sch">' + esc(EN ? tr(r.scholarship) : nb(r.scholarship)) + "</span>" + (r.note ? "<small>" + esc(tr(r.note)) + "</small>" : "") : "—";
        return "<tr" + (r.scholarship ? ' class="has-sch"' : "") + ">" +
          '<td class="nm-cell"><span class="uni-dot" style="--c:' + esc(r.color || "#283090") + '"></span>' +
          '<span class="nm"' + (r.check && !EN ? "" : ' lang="en"') + ">" + esc(tr(r.university)) + "</span>" +
          "<small>" + (EN ? "" : esc(nb(r.ko))) + '<span class="st-inline">' + (EN ? "" : " · ") + esc(r.state) + "</span>" + (r.check ? ' <span class="tag-sample">' + (EN ? "Name TBC" : "명칭 확인") + "</span>" : "") + "</small></td>" +
          '<td class="st">' + esc(r.state) + '</td>' +
          '<td class="sch-cell">' + sch + "</td></tr>";
      }).join("");
    }
    if (summary) {
      summary.innerHTML = EN ? "<b>" + rows.length + "</b> universities" : "대학 <b>" + rows.length + "</b>곳";
    }
  }
  if (stateSel) stateSel.addEventListener("change", renderResults);
  if (query) query.addEventListener("input", renderResults);
  renderResults();

  /* 3. 세 곳 카드: 사진이 없으면 남색 판, 휴대폰 가로 넘김 번호 */
  document.querySelectorAll(".place img").forEach(function (img) {
    var mark = function () { img.alt = ""; img.closest(".place").classList.add("missing"); };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) mark();
    img.addEventListener("error", mark);
  });
  var placesRow = document.getElementById("places-row");
  var placesCount = document.getElementById("places-count");
  if (placesRow && placesCount) {
    var cards = placesRow.querySelectorAll(".place");
    var ticking = false;
    placesRow.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var w = cards[0] ? cards[0].getBoundingClientRect().width + 12 : 1;
        var k = Math.min(cards.length, Math.max(1, Math.round(placesRow.scrollLeft / w) + 1));
        placesCount.textContent = k + " / " + cards.length;
      });
    }, { passive: true });
  }

  /* 4. 진학 노선도 */
  var line = document.getElementById("route-line");
  if (line) {
    var stops = line.querySelectorAll("li");
    var startFor = function (age) { return age < 6 ? 0 : age < 13 ? 1 : age < 18 ? 2 : 3; };
    var copy = EN ? [
      ["Start in Early Years → Grades 1–8 → Texas → U.S. university", "Children begin English and school life in Eulogia Early Years, then continue into the elementary and middle program. From about Grade 8 they can move to a high school in Texas."],
      ["Start in SOT·Abeka → high school in Texas → Blinn College → U.S. university", "After at least six months at Eulogia and a school recommendation, students can move to a high school in Texas <b>from Grade 8</b>."],
      ["Start at a high school in Texas → Blinn College → Texas A&M and U.S. universities", "Students prepare at Eulogia for at least six months, then go to a high school in Texas, where <b>dual credit at Blinn College</b> and AP courses give them a head start on university."],
      ["Start at Blinn College → transfer to Texas A&M", "High school graduates study at Blinn College for <b>one to two years</b>, then transfer to Texas A&amp;M. A Blinn nursing pathway is also available."]
    ] : [
      ["유아반에서 출발 → 초·중등 → 텍사스 → 미국 대학", "율로기아 유아반에서 영어와 학교생활을 시작하고, 초·중등 과정으로 이어집니다. 8학년 무렵부터 텍사스 현지 고교로 갈 수 있습니다."],
      ["초·중등 SOT·Abeka에서 출발 → 텍사스 현지 고교 → 블린 칼리지 → 미국 대학", "율로기아에서 6개월 이상 공부하고 학교 추천을 받으면 <b>8학년부터</b> 텍사스 현지 고교로 진학할 수 있습니다."],
      ["텍사스 현지 고교에서 출발 → 블린 칼리지 → 텍사스 A&M·미국 대학", "율로기아에서 6개월 이상 준비한 뒤 텍사스 현지 고교로 갑니다. 재학 중 <b>블린 칼리지 학점 선이수</b>와 AP를 들어 대학 준비를 앞당깁니다."],
      ["블린 칼리지에서 출발 → 텍사스 A&M 편입", "고교를 마친 학생은 블린 칼리지에서 <b>1~2년</b> 공부한 뒤 텍사스 A&amp;M으로 편입합니다. 블린 간호 과정으로 이어지는 진로도 있습니다."]
    ];
    var paint = function (age) {
      var st = startFor(age);
      stops.forEach(function (li, i) {
        li.classList.toggle("past", i < st);
        li.classList.toggle("here", i === st);
        li.classList.toggle("on", i >= st);
        var badge = li.querySelector(".badge");
        if (i === st && !badge) {
          badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = EN ? "Start" : "출발";
          li.querySelector("b").appendChild(badge);
        } else if (i !== st && badge) badge.remove();
      });
      setText("route-start", copy[st][0]);
      var b = document.getElementById("route-years");
      if (b) b.innerHTML = copy[st][1];
      var cta = document.getElementById("route-cta");
      if (cta) cta.setAttribute("data-program", ["early-years", "sot", "texas-hs", "blinn"][st]);
    };
    document.querySelectorAll(".age-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".age-btn").forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
        paint(+btn.getAttribute("data-age"));
      });
    });
    paint(9);
  }

  /* 5. 텍사스 사진: 모두 없으면 사진 줄과 안내문을 함께 숨김 */
  var strip = document.getElementById("tx-strip");
  if (strip) {
    var figs = strip.querySelectorAll("figure");
    strip.querySelectorAll("img").forEach(function (img) {
      var mark = function () {
        img.closest("figure").classList.add("missing");
        if (strip.querySelectorAll("figure.missing").length === figs.length) strip.classList.add("all-missing");
      };
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) mark();
      img.addEventListener("error", mark);
    });
  }

  /* 5b. 성장 기록: 학년별 GPA 선 그래프 (SVG, 실제 픽셀 크기로) */
  var chart = document.getElementById("gpa-chart");
  if (chart && growth.length) {
    var lastW = 0;
    var drawChart = function () {
      var W = Math.round(chart.clientWidth);
      if (!W || W === lastW) return;
      lastW = W;
      var H = Math.max(220, Math.min(320, Math.round(W * 0.66))), L = 34, R = 54, T = 16, B = 28;
      var xs = growth[0].gpa.map(function (p) { return p[0]; });
      var x = function (i) { return L + i * (W - L - R) / (xs.length - 1); };
      var y = function (v) { return T + (4 - v) / 3 * (H - T - B); };   /* 1.0 ~ 4.0 */
      var svg = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
      [1, 2, 3, 4].forEach(function (g) {
        svg += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '"/>' +
          '<text class="tick" x="' + (L - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end">' + g.toFixed(1) + "</text>";
      });
      xs.forEach(function (lab, i) {
        var anchor = i === 0 ? "start" : i === xs.length - 1 ? "end" : "middle";
        var tx = i === 0 ? x(i) - 10 : i === xs.length - 1 ? x(i) + 10 : x(i);
        svg += '<text class="tick" x="' + tx + '" y="' + (H - 6) + '" text-anchor="' + anchor + '">' + esc(lab) + "</text>";
      });
      growth.forEach(function (g, k) {
        var pts = g.gpa.map(function (p, i) { return x(i) + "," + y(p[1]); }).join(" ");
        svg += '<polyline class="ln s' + k + '" points="' + pts + '"/>';
        g.gpa.forEach(function (p, i) {
          svg += '<circle class="pt s' + k + '" cx="' + x(i) + '" cy="' + y(p[1]) + '" r="' + (i === g.gpa.length - 1 ? 5 : 3.5) + '"/>';
        });
        var last = g.gpa[g.gpa.length - 1];
        svg += '<text class="end s' + k + '" x="' + (x(g.gpa.length - 1) + 10) + '" y="' + (y(last[1]) + (k === 0 ? 16 : -4)) + '">' + last[1].toFixed(2) + "</text>";
      });
      chart.innerHTML = svg + "</svg>";
    };
    drawChart();
    if (window.ResizeObserver) new ResizeObserver(debounce(drawChart, 100)).observe(chart);
    var leg = document.getElementById("gpa-legend");
    if (leg) leg.innerHTML = growth.map(function (g, k) {
      return '<li class="s' + k + '"><b>' + esc(g.label) + " · " + esc(g.tag) + ' <span class="gv">' +
        g.gpa[0][1].toFixed(2) + " → " + g.gpa[g.gpa.length - 1][1].toFixed(2) + "</span></b>" +
        "<span>" + g.notes.map(function (n) { return esc(n.replace(/ · /g, " \u00b7\u00a0")); }).join(" \u00b7\u00a0") + "</span></li>";
    }).join("");
  }

  /* 장학금 사례: 청구액 중 장학금 비율 막대 */
  var aidEl = document.getElementById("aid");
  if (aidEl && aidCase) {
    var pct = Math.round(aidCase.aid / aidCase.charges * 100);
    aidEl.innerHTML =
      '<div class="aid-big"><b>' + pct + "%</b><span>" + (EN ? " covered by scholarship" : "를 장학금으로") + "</span></div>" +
      '<div class="aid-bar" role="img" aria-label="' + (EN ? "Charges " + money(aidCase.charges) + ", scholarship " + money(aidCase.aid) + ", paid " + money(aidCase.net) : "청구액 " + money(aidCase.charges) + " 중 장학금 " + money(aidCase.aid) + ", 실제 부담 " + money(aidCase.net)) + '">' +
      '<span class="aid-a" style="width:' + pct + '%"></span><span class="aid-n" style="width:' + (100 - pct) + '%"></span></div>' +
      '<dl class="aid-dl"><div><dt>' + (EN ? "First-semester charges" : esc(aidCase.term) + " 청구액") + "</dt><dd>" + money(aidCase.charges) + "</dd></div>" +
      '<div class="a"><dt>' + (EN ? "Scholarship" : "장학금") + "</dt><dd>−" + money(aidCase.aid) + "</dd></div>" +
      '<div class="n"><dt>' + (EN ? "Amount paid" : "실제 부담") + "</dt><dd>" + money(aidCase.net) + "</dd></div></dl>";
  }

  /* 블린 첫 학기 4.0: 기수별 점 */
  var coEl = document.getElementById("cohorts");
  if (coEl && cohorts.length) {
    coEl.innerHTML = '<div class="co-big"><b>4.0</b><span>기수마다 만점자</span></div>' +
      '<ul class="co-chips" aria-label="첫 학기 GPA 4.0을 받은 기수">' + cohorts.map(function (c) {
        return "<li><b>" + esc(c.label) + "</b><span>4.0</span></li>";
      }).join("") + "</ul>" +
      '<p class="co-note">블린&nbsp;칼리지 첫 학기 GPA 4.0 → 텍사스&nbsp;A&amp;M 진학</p>';
  }

  /* 6c. 학사 일정: 오늘 이후 4개 + 전체 표 */
  var calEl = document.getElementById("cal-list");
  if (calEl) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var upcoming = calendar.filter(function (e) { return parse(e.end) >= today; })
      .sort(function (a, b) { return parse(a.start) - parse(b.start); }).slice(0, 4);
    if (!upcoming.length) upcoming = calendar.slice(-4);
    var kind = { term: ["학기", "Term"], break: ["방학", "Break"], event: ["행사", "Event"], staff: ["교사", "Staff"] };
    var fmt = function (s) { var d = parse(s); return (d.getMonth() + 1) + "." + d.getDate(); };
    var rangeOf = function (e) { return e.start === e.end ? fmt(e.start) : fmt(e.start) + " – " + fmt(e.end); };
    var allBody = document.getElementById("cal-all-body");
    if (allBody) {
      allBody.innerHTML = calendar.slice().sort(function (a, b) { return parse(a.start) - parse(b.start); }).map(function (e) {
        var past = parse(e.end) < today;
        var k = kind[e.cat] || ["", ""];
        if (EN) return "<tr" + (past ? ' class="past"' : "") + '><td class="yr">' + esc(rangeOf(e)) + "</td><td>" + esc(e.en) + "</td><td>" + esc(k[1]) + "</td></tr>";
        return "<tr" + (past ? ' class="past"' : "") + '><td class="yr">' + esc(rangeOf(e)) + "</td><td>" + esc(e.ko) + '<small lang="en">' + esc(e.en) + "</small></td><td>" + esc(k[0]) + ' <span lang="en">' + esc(k[1]) + "</span></td></tr>";
      }).join("");
    }
    calEl.innerHTML = upcoming.map(function (e) {
      var k = kind[e.cat] || ["", ""];
      if (EN) return '<li class="' + esc(e.cat) + '"><span class="k"><span>' + esc(k[1]) + "</span></span>" +
        '<span class="d">' + esc(rangeOf(e)) + "</span>" +
        '<span class="t">' + esc(e.en) + "</span></li>";
      return '<li class="' + esc(e.cat) + '"><span class="k"><span>' + esc(k[0]) + '</span> <span lang="en">' + esc(k[1]) + "</span></span>" +
        '<span class="d">' + esc(rangeOf(e)) + "</span>" +
        '<span class="t">' + esc(e.ko) + '<small lang="en">' + esc(e.en) + "</small></span></li>";
    }).join("");
  }

  /* 7. 상담 신청서: 내용이 채워진 메일을 열어 학교 신청 메일로 보냄 */
  var form = document.getElementById("apply-form");
  var applyEmail = (window.EULOGIA_CONFIG || {}).applyEmail || "eulogiaschool@gmail.com";
  if (form) {
    document.querySelectorAll("[data-program]").forEach(function (a) {
      a.addEventListener("click", function () {
        var sel = document.getElementById("f-program");
        if (sel) sel.value = a.getAttribute("data-program");
      });
    });
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var label = function (id) { var el = document.getElementById(id); return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].text : ""; };
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var lines = EN ? [
        "Parent's name: " + val("f-name"),
        "Phone: " + val("f-phone"),
        "E-mail: " + val("f-email"),
        "Program: " + label("f-program"),
        "Preferred date: " + (val("f-date") || "-"),
        "Preferred time: " + (label("f-time") || "-"),
        "Visitors: " + (val("f-people") || "-"),
        "Language: " + val("f-lang"),
        "Message: " + (val("f-msg") || "-")
      ] : [
        "보호자 이름: " + val("f-name"),
        "연락처: " + val("f-phone"),
        "이메일: " + val("f-email"),
        "희망 과정: " + label("f-program"),
        "희망 날짜: " + (val("f-date") || "-"),
        "희망 시간: " + (label("f-time") || "-"),
        "인원: " + (val("f-people") || "-"),
        "상담 언어: " + val("f-lang"),
        "요청 사항: " + (val("f-msg") || "-")
      ];
      var body = lines.join("\n");
      var subject = (EN ? "[Admissions enquiry] " : "[입학 상담 신청] ") + val("f-name") + " · " + label("f-program");
      var msg = document.getElementById("form-msg");
      if (msg) {
        msg.hidden = false;
        msg.innerHTML = (EN ? "Press <b>Send</b> in your mail app to finish. If no mail app opens, copy the text below and e-mail it to " :
          "메일 앱에서 <b>보내기</b>를 누르면 신청이 끝납니다. 메일 앱이 열리지 않으면 아래 내용을 복사해 ") +
          '<a href="mailto:' + esc(applyEmail) + '">' + esc(applyEmail) + "</a>" + (EN ? ", or call the school." : " 로 보내 주시거나 학교로 전화해 주세요.") +
          "<pre>" + esc(subject + "\n\n" + body) + "</pre>";
      }
      window.location.href = "mailto:" + applyEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* 모바일 메뉴 */
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    var setOpen = function (open) { menu.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); };
    menuBtn.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setOpen(false); menuBtn.focus(); } });
  }

  /* 메뉴 위치 표시 (scroll-spy) */
  var navLinks = document.querySelectorAll(".menu a, .mobile-menu a");
  var setCurrent = function (key) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + key) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setCurrent(en.target.getAttribute("data-nav")); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("[data-nav]").forEach(function (s) { spy.observe(s); });
  }

  /* 휴대폰 아래 고정 막대: 첫 화면 버튼이 사라지면 보이고, 신청서를 보는 동안 숨김 */
  var mbar = document.getElementById("mbar");
  var heroCta = document.querySelector(".hero-cta");
  var applyEl = document.getElementById("apply");
  if (mbar) {
    if (!("IntersectionObserver" in window) || !heroCta) {
      mbar.removeAttribute("inert");
      mbar.classList.add("show");
    } else {
      var heroOut = false, applyIn = false, formFocus = false;
      var sync = function () {
        var show = heroOut && !applyIn && !formFocus;
        mbar.classList.toggle("show", show);
        if (show) mbar.removeAttribute("inert"); else mbar.setAttribute("inert", "");
      };
      new IntersectionObserver(function (en) { heroOut = !en[en.length - 1].isIntersecting; sync(); }).observe(heroCta);
      if (applyEl) new IntersectionObserver(function (en) {
        var e = en[en.length - 1];
        /* 신청서가 화면의 20% 이상을 차지하면 숨김 (신청서가 화면보다 길어도 동작하도록 화면 기준으로 계산) */
        applyIn = e.isIntersecting && (e.intersectionRatio >= 0.2 || e.intersectionRect.height >= 0.2 * window.innerHeight);
        sync();
      }, { threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1] }).observe(applyEl);
      if (form) {
        form.addEventListener("focusin", function () { formFocus = true; sync(); });
        form.addEventListener("focusout", function () { formFocus = false; sync(); });
      }
    }
  }
})();
