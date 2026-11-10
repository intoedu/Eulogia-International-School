(function () {
  var results = window.EULOGIA_RESULTS || [];
  var stats = window.EULOGIA_STATS || {};
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
  var money = function (n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  /* 장학금 받은 대학 먼저, 그다음 합격 인원 순 */
  var ranked = results.slice().sort(function (a, b) {
    var sa = a.scholarship ? 1 : 0, sb = b.scholarship ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return (b.count || 0) - (a.count || 0);
  });
  var total = results.reduce(function (t, r) { return t + (r.count || 0); }, 0);

  /* 첫 화면: 사진 넘기기 */
  var slidesEl = document.getElementById("slides");
  var dotsEl = document.getElementById("slide-dots");
  var capEl = document.getElementById("slide-cap");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (slidesEl && (window.EULOGIA_SLIDES || []).length) {
    var wanted = window.EULOGIA_SLIDES, ready = [];
    var checked = 0;
    var start = function () {
      ready.sort(function (a, b) { return a.i - b.i; });
      if (ready.length < 2) return;
      slidesEl.innerHTML = ready.map(function (r, k) {
        return '<img class="slide' + (k === 0 ? " on" : "") + '" src="' + esc(r.src) + '" alt="">';
      }).join("");
      var imgs = slidesEl.querySelectorAll(".slide");
      dotsEl.innerHTML = ready.map(function (r, k) {
        return '<button type="button" aria-label="' + esc(r.place) + '"' + (k === 0 ? ' aria-current="true"' : "") + "></button>";
      }).join("");
      var dots = dotsEl.querySelectorAll("button");
      var cur = 0, timer = null;
      var show = function (k) {
        cur = (k + ready.length) % ready.length;
        imgs.forEach(function (im, n) { im.classList.toggle("on", n === cur); });
        dots.forEach(function (d, n) { if (n === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
        if (capEl) capEl.textContent = ready[cur].place;
      };
      var play = function () { if (!reduceMotion) { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 5500); } };
      dots.forEach(function (d, n) { d.addEventListener("click", function () { show(n); play(); }); });
      document.addEventListener("visibilitychange", function () { if (document.hidden) clearInterval(timer); else play(); });
      play();
    };
    wanted.forEach(function (w, i) {
      var im = new Image();
      im.onload = function () { ready.push({ i: i, src: w.src, place: w.place }); if (++checked === wanted.length) start(); };
      im.onerror = function () { if (++checked === wanted.length) start(); };
      im.src = w.src;
    });
  }

  /* 합격 대학 벽: 장학금 대학을 크게, 다음 4곳은 카드, 나머지는 칩 */
  var unisEl = document.getElementById("unis");
  var chipsEl = document.getElementById("uni-chips");
  if (unisEl) {
    var card = function (r, feature) {
      var sch = r.scholarship ? r.scholarship.replace("최대 ", "") : "";
      return '<li class="uni' + (feature ? " feature" : "") + '" style="--c:' + esc(r.color || "#283090") + '">' +
        '<span class="mono" aria-hidden="true">' + esc(r.abbr || "") + "</span>" +
        '<span class="uni-body"><b>' + esc(r.university) + "</b>" +
        '<span class="uni-ko">' + esc(r.ko) + " · " + esc(r.state) + "</span></span>" +
        (feature && sch ? '<span class="uni-sch"><small>최대</small><b>' + esc(sch) + "</b><span>장학금" + (r.note ? "<br>" + esc(r.note) : "") + "</span></span>" : "") +
        '<span class="uni-n"><b>' + esc(r.count) + "</b>명 합격</span>" +
        "</li>";
    };
    var featured = ranked.filter(function (r) { return r.scholarship; }).slice(0, 1);
    var rest = ranked.filter(function (r) { return featured.indexOf(r) === -1; });
    unisEl.innerHTML = featured.map(function (r) { return card(r, true); }).join("") +
      rest.slice(0, 4).map(function (r) { return card(r, false); }).join("");
    if (chipsEl) chipsEl.innerHTML = rest.slice(4).map(function (r) {
      return '<li style="--c:' + esc(r.color || "#283090") + '"><i aria-hidden="true"></i>' + esc(r.university) + " <span>" + esc(r.count) + "명</span></li>";
    }).join("");
    setText2("wall-total", total);
    setText2("wall-unis", results.length);
  }
  function setText2(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  /* 숫자 띠 */
  var setText = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
  if (stats.admits) setText("stat-admits", stats.admits);
  setText("stat-perfect", cohorts.reduce(function (t, c) { return t + c.n; }, 0));

  /* 진학 노선도 */
  var line = document.getElementById("route-line");
  if (line) {
    var stops = line.querySelectorAll("li");
    var startFor = function (age) { return age < 6 ? 0 : age < 13 ? 1 : age < 18 ? 2 : 3; };
    var copy = [
      ["유아반에서 출발 → 초·중등 → 텍사스 → 미국 대학", "율로기아 유아반에서 영어와 학교생활을 시작하고, 초·중등 과정으로 이어집니다. 8학년 무렵부터 텍사스 현지 고교로 갈 수 있습니다."],
      ["초·중등 SOT·Abeka에서 출발 → 텍사스 현지 고교 → 블린 칼리지 → 미국 대학", "율로기아에서 6개월 이상 공부하고 학교 추천을 받으면 <b>8학년부터</b> 텍사스 현지 고교로 진학할 수 있습니다."],
      ["텍사스 현지 고교에서 출발 → 블린 칼리지 → 텍사스 A&M·미국 대학", "율로기아에서 6개월 이상 준비한 뒤 텍사스 현지 고교로 갑니다. 재학 중 <b>블린 칼리지 학점 선이수</b>와 AP를 들어 대학 준비를 앞당깁니다."],
      ["블린 칼리지에서 출발 → 텍사스 A&M 편입", "고교를 마친 학생은 블린 칼리지에서 <b>1~2년</b> 공부한 뒤 텍사스 A&amp;M으로 편입합니다. 블린 간호 과정으로 이어지는 진로도 있습니다."]
    ];
    var paint = function (age) {
      var st = startFor(age);
      stops.forEach(function (li, i) {
        li.classList.toggle("past", i < st);
        li.classList.toggle("here", i === st);
        li.classList.toggle("on", i >= st);
        li.style.setProperty("--on", i > st ? 1 : 0);
      });
      var a = document.getElementById("route-start"), b = document.getElementById("route-years");
      if (a) a.textContent = copy[st][0];
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

  /* 성장 기록: 학년별 GPA 선 그래프 (SVG) */
  var chart = document.getElementById("gpa-chart");
  if (chart && growth.length) {
    var W = 560, H = 260, L = 40, R = 70, T = 18, B = 34;
    var xs = growth[0].gpa.map(function (p) { return p[0]; });
    var x = function (i) { return L + i * (W - L - R) / (xs.length - 1); };
    var y = function (v) { return T + (4 - v) / 3 * (H - T - B); };   /* 1.0 ~ 4.0 */
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
    [1, 2, 3, 4].forEach(function (g) {
      svg += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '"/>' +
        '<text class="tick" x="' + (L - 10) + '" y="' + (y(g) + 4) + '" text-anchor="end">' + g.toFixed(1) + "</text>";
    });
    xs.forEach(function (lab, i) {
      svg += '<text class="tick" x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(lab) + "</text>";
    });
    growth.forEach(function (g, k) {
      var pts = g.gpa.map(function (p, i) { return x(i) + "," + y(p[1]); }).join(" ");
      svg += '<polyline class="ln s' + k + '" points="' + pts + '"/>';
      g.gpa.forEach(function (p, i) {
        svg += '<circle class="pt s' + k + '" cx="' + x(i) + '" cy="' + y(p[1]) + '" r="' + (i === g.gpa.length - 1 ? 6 : 4) + '"/>';
      });
      var last = g.gpa[g.gpa.length - 1];
      svg += '<text class="end s' + k + '" x="' + (x(g.gpa.length - 1) + 12) + '" y="' + (y(last[1]) + (k === 0 ? 14 : -4)) + '">' + last[1].toFixed(2) + "</text>";
    });
    chart.innerHTML = svg + "</svg>";
    var leg = document.getElementById("gpa-legend");
    if (leg) leg.innerHTML = growth.map(function (g, k) {
      return '<li class="s' + k + '"><b>' + esc(g.label) + " · " + esc(g.tag) + "</b> " +
        g.gpa[0][1].toFixed(2) + " → " + g.gpa[g.gpa.length - 1][1].toFixed(2) +
        "<span>" + g.notes.map(esc).join(" · ") + "</span></li>";
    }).join("");
  }

  /* 장학금 사례: 청구액 중 장학금 비율 막대 */
  var aidEl = document.getElementById("aid");
  if (aidEl && aidCase) {
    var pct = Math.round(aidCase.aid / aidCase.charges * 100);
    aidEl.innerHTML =
      '<div class="aid-big"><b>' + pct + "%</b><span>를 장학금으로</span></div>" +
      '<div class="aid-bar" role="img" aria-label="청구액 ' + money(aidCase.charges) + " 중 장학금 " + money(aidCase.aid) + ", 실제 부담 " + money(aidCase.net) + '">' +
      '<span class="aid-a" style="width:' + pct + '%"></span><span class="aid-n" style="width:' + (100 - pct) + '%"></span></div>' +
      '<dl class="aid-dl"><div><dt>' + esc(aidCase.term) + " 청구액</dt><dd>" + money(aidCase.charges) + "</dd></div>" +
      '<div class="a"><dt>장학금</dt><dd>−' + money(aidCase.aid) + "</dd></div>" +
      '<div class="n"><dt>실제 부담</dt><dd>' + money(aidCase.net) + "</dd></div></dl>";
  }

  /* 블린 첫 학기 4.0: 기수별 점 */
  var coEl = document.getElementById("cohorts");
  if (coEl && cohorts.length) {
    var sum = cohorts.reduce(function (t, c) { return t + c.n; }, 0);
    coEl.innerHTML = '<div class="co-big"><b>' + sum + "명</b><span>첫 학기 4.0 만점</span></div><ul>" +
      cohorts.map(function (c) {
        var dots = "";
        for (var i = 0; i < c.n; i++) dots += '<i style="--i:' + i + '"></i>';
        return "<li><span>" + esc(c.label) + "</span><span class=\"dots\">" + dots + "</span><b>" + c.n + "</b></li>";
      }).join("") + "</ul>";
  }

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
      tbody.innerHTML = '<tr><td colspan="4" class="empty">조건에 맞는 대학이 없습니다. 검색어나 주를 바꿔 보세요.</td></tr>';
    } else {
      tbody.innerHTML = rows.map(function (r) {
        var sch = r.scholarship ? '<span class="sch">' + esc(r.scholarship) + "</span>" + (r.note ? "<small>" + esc(r.note) + "</small>" : "") : "—";
        return "<tr><td><span class=\"uni\"><span class=\"uni-dot\" style=\"--c:" + esc(r.color || "#283090") + "\"></span>" + esc(r.university) + "</span><small>" + esc(r.ko) + (r.check ? ' <span class="tag-sample">명칭 확인</span>' : "") + "</small></td>" +
          "<td>" + esc(r.state) + "</td><td class=\"num\">" + esc(r.count) + "명</td><td>" + sch + "</td></tr>";
      }).join("");
    }
    if (summary) {
      var n = rows.reduce(function (t, r) { return t + (r.count || 0); }, 0);
      summary.innerHTML = "대학 <b>" + rows.length + "</b>곳 · 합격 <b>" + n + "</b>명";
    }
  }
  if (stateSel) stateSel.addEventListener("change", renderResults);
  if (query) query.addEventListener("input", renderResults);
  renderResults();

  /* 사진 파일이 없으면 깨진 그림 대신 「사진 준비 중」 표시 */
  document.querySelectorAll(".place img").forEach(function (img) {
    var mark = function () { img.closest(".place").classList.add("missing"); };
    if (img.complete && img.naturalWidth === 0) mark();
    else img.addEventListener("error", mark);
  });
  var strip = document.querySelector(".tx-photos");
  if (strip) {
    var figs = strip.querySelectorAll("figure");
    strip.querySelectorAll("img").forEach(function (img) {
      var mark = function () {
        img.closest("figure").classList.add("missing");
        if (strip.querySelectorAll("figure.missing").length === figs.length) strip.classList.add("all-missing");
      };
      if (img.complete && img.naturalWidth === 0) mark();
      else img.addEventListener("error", mark);
    });
  }

  /* 학사 일정: 오늘 이후 4개 */
  var calEl = document.getElementById("cal-list");
  if (calEl) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var upcoming = calendar.filter(function (e) { return parse(e.end) >= today; })
      .sort(function (a, b) { return parse(a.start) - parse(b.start); }).slice(0, 4);
    if (!upcoming.length) upcoming = calendar.slice(-4);
    var kind = { term: "학기 Term", break: "방학 Break", event: "행사 Event", staff: "교사 Staff" };
    var fmt = function (s) { var d = parse(s); return (d.getMonth() + 1) + "." + d.getDate(); };
    var allBody = document.getElementById("cal-all-body");
    if (allBody) {
      allBody.innerHTML = calendar.slice().sort(function (a, b) { return parse(a.start) - parse(b.start); }).map(function (e) {
        var range = e.start === e.end ? fmt(e.start) : fmt(e.start) + " – " + fmt(e.end);
        var past = parse(e.end) < today;
        return "<tr" + (past ? ' class="past"' : "") + '><td class="yr">' + esc(range) + "</td><td>" + esc(e.ko) + "<small>" + esc(e.en) + "</small></td><td>" + esc(kind[e.cat] || "") + "</td></tr>";
      }).join("");
    }
    calEl.innerHTML = upcoming.map(function (e) {
      var range = e.start === e.end ? fmt(e.start) : fmt(e.start) + " – " + fmt(e.end);
      return '<li class="' + esc(e.cat) + '"><span class="k">' + esc(kind[e.cat] || "") + "</span>" +
        '<span class="d">' + esc(range) + "</span>" +
        '<span class="t">' + esc(e.ko) + "<small>" + esc(e.en) + "</small></span></li>";
    }).join("");
  }

  /* 상담 신청서: 내용이 채워진 메일을 열어 학교 신청 메일로 보냄 */
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
      var lines = [
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
      var subject = "[입학 상담 신청] " + val("f-name") + " · " + label("f-program");
      var msg = document.getElementById("form-msg");
      if (msg) {
        msg.hidden = false;
        msg.innerHTML = "메일 앱에서 <b>보내기</b>를 누르면 신청이 끝납니다. 메일 앱이 열리지 않으면 아래 내용을 복사해 " +
          '<a href="mailto:' + esc(applyEmail) + '">' + esc(applyEmail) + "</a> 로 보내 주시거나 학교로 전화해 주세요." +
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
})();
