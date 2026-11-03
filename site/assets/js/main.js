(function () {
  var results = window.EULOGIA_RESULTS || [];
  var highlight = window.EULOGIA_HIGHLIGHT || null;
  var calendar = window.EULOGIA_CALENDAR || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 첫 화면: 졸업생이 진학한 미국 대학 명단 (모든 대학을 한 번에) */
  var byUni = {};
  results.forEach(function (r) {
    var u = byUni[r.university] || (byUni[r.university] = { name: r.university, years: [], sch: "", sample: false });
    if (u.years.indexOf(r.year) === -1) u.years.push(r.year);
    if (r.scholarship && !u.sch) u.sch = r.scholarship;
    if (r.sample) u.sample = true;
  });
  var unis = Object.keys(byUni).map(function (k) { return byUni[k]; }).sort(function (a, b) {
    var sa = a.sch ? 1 : 0, sb = b.sch ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return Math.max.apply(null, b.years) - Math.max.apply(null, a.years);
  });
  var roll = document.getElementById("roll");
  if (roll) {
    roll.innerHTML = unis.map(function (u, i) {
      var last = i === unis.length - 1;
      return '<span class="u" style="--i:' + i + '">' + esc(u.name) +
        (u.sch ? "<sup>" + esc(u.sch) + " 장학금</sup>" : "") +
        (last ? "" : '<span class="dot" aria-hidden="true">·</span>') + "</span>";
    }).join(" ");
  }
  var years = results.map(function (r) { return r.year; });
  var yEl = document.getElementById("hero-years");
  if (yEl && years.length) {
    var lo = Math.min.apply(null, years), hi = Math.max.apply(null, years);
    yEl.textContent = lo === hi ? String(hi) : lo + "–" + hi;
  }
  var key = document.getElementById("roll-key");
  if (key && highlight) {
    key.innerHTML = "<b>" + esc(highlight.year) + "</b> " + esc(highlight.university) + " <b>" + esc(highlight.percent) +
      " 장학금</b> · " + esc(highlight.students);
  }
  var sampleTag = document.getElementById("news-sample");
  if (sampleTag) sampleTag.hidden = !unis.some(function (u) { return u.sample; });

  /* 진학 실적 표: 연도 선택 + 검색 */
  var yearSel = document.getElementById("res-year");
  var query = document.getElementById("res-q");
  var tbody = document.getElementById("res-body");
  var summary = document.getElementById("res-summary");
  var years = results.map(function (r) { return r.year; }).filter(function (y, i, a) { return a.indexOf(y) === i; }).sort(function (a, b) { return b - a; });
  if (yearSel) {
    years.forEach(function (y) {
      var o = document.createElement("option");
      o.value = String(y); o.textContent = y + "년";
      yearSel.appendChild(o);
    });
  }
  function renderResults() {
    if (!tbody) return;
    var y = yearSel ? yearSel.value : "";
    var q = query ? query.value.trim().toLowerCase() : "";
    var rows = results.filter(function (r) {
      if (y && String(r.year) !== y) return false;
      if (!q) return true;
      return [r.university, r.state, r.student, r.route, r.scholarshipName].join(" ").toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return b.year - a.year; });
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">조건에 맞는 진학 기록이 없습니다. 연도나 검색어를 바꿔 보세요.</td></tr>';
    } else {
      tbody.innerHTML = rows.map(function (r) {
        var sch = r.scholarship ? '<span class="sch">' + esc(r.scholarship) + " 장학금</span>" + (r.scholarshipName ? "<small>" + esc(r.scholarshipName) + "</small>" : "") : "—";
        return "<tr>" +
          '<td class="yr">' + esc(r.year) + "</td>" +
          "<td><span class=\"uni\">" + esc(r.university) + "</span>" + (r.sample ? ' <span class="tag-sample">샘플</span>' : "") + "<small>" + esc(r.state) + "</small></td>" +
          "<td>" + sch + "</td>" +
          "<td>" + esc(r.route) + "</td>" +
          "<td>" + esc(r.student) + "</td></tr>";
      }).join("");
    }
    if (summary) {
      var u = {};
      rows.forEach(function (r) { u[r.university] = 1; });
      var s = rows.filter(function (r) { return r.scholarship; }).length;
      summary.innerHTML = "<b>" + rows.length + "</b>건 · 대학 <b>" + Object.keys(u).length + "</b>곳 · 장학금 <b>" + s + "</b>건";
    }
  }
  if (yearSel) yearSel.addEventListener("change", renderResults);
  if (query) query.addEventListener("input", renderResults);
  renderResults();

  /* 학사 일정: 오늘 이후 일정 4개 */
  var calEl = document.getElementById("cal-list");
  if (calEl) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var upcoming = calendar.filter(function (e) { return parse(e.end) >= today; })
      .sort(function (a, b) { return parse(a.start) - parse(b.start); }).slice(0, 4);
    if (!upcoming.length) upcoming = calendar.slice(-4);
    var kind = { term: "학기 Term", break: "방학 Break", event: "행사 Event", staff: "교사 Staff" };
    var fmt = function (s) { var d = parse(s); return (d.getMonth() + 1) + "." + d.getDate(); };
    calEl.innerHTML = upcoming.map(function (e) {
      var range = e.start === e.end ? fmt(e.start) : fmt(e.start) + " – " + fmt(e.end);
      return '<li class="' + esc(e.cat) + '"><span class="k">' + esc(kind[e.cat] || "") + "</span>" +
        '<span class="d">' + esc(range) + "</span>" +
        '<span class="t">' + esc(e.ko) + "<small>" + esc(e.en) + "</small></span></li>";
    }).join("");
  }

  /* 상담 신청서: 초안이라 실제로 보내지 않음 */
  var form = document.getElementById("apply-form");
  if (form) {
    var programParam = function (val) {
      var sel = document.getElementById("f-program");
      if (sel && val) sel.value = val;
    };
    document.querySelectorAll("[data-program]").forEach(function (a) {
      a.addEventListener("click", function () { programParam(a.getAttribute("data-program")); });
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var msg = document.getElementById("form-msg");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (msg) {
        msg.hidden = false;
        msg.textContent = "초안 화면입니다. 실제 접수는 신청서 연결 후 시작됩니다. 입력하신 내용은 보내지 않았습니다.";
      }
    });
  }
})();
