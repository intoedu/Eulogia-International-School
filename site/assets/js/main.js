(function () {
  var results = window.EULOGIA_RESULTS || [];
  var highlight = window.EULOGIA_HIGHLIGHT || null;
  var calendar = window.EULOGIA_CALENDAR || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 첫 화면: 졸업생 진학 대학 (흘러가는 이름 줄) */
  var tickerEl = document.getElementById("admit-ticker");
  if (tickerEl) {
    var byUni = {};
    results.forEach(function (r) {
      var u = byUni[r.university] || (byUni[r.university] = { name: r.university, years: [], sch: "" });
      if (u.years.indexOf(r.year) === -1) u.years.push(r.year);
      if (r.scholarship && !u.sch) u.sch = r.scholarship;
    });
    var unis = Object.keys(byUni).map(function (k) { return byUni[k]; })
      .sort(function (a, b) { return Math.max.apply(null, b.years) - Math.max.apply(null, a.years); });
    var item = function (u, hidden) {
      return '<div class="uni-item"' + (hidden ? ' aria-hidden="true"' : "") + "><b>" + esc(u.name) + "</b><span>" +
        u.years.sort().join(" · ") + (u.sch ? ' · <em>' + esc(u.sch) + " 장학금</em>" : "") + "</span></div>";
    };
    var loop = unis.slice();
    while (loop.length && loop.length < 6) loop = loop.concat(unis);
    tickerEl.innerHTML = loop.map(function (u) { return item(u, false); }).join("") +
      loop.map(function (u) { return item(u, true); }).join("");
  }

  /* 첫 화면: 올해 장학금 소식 */
  if (highlight) {
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set("news-year", highlight.year);
    set("news-pct", highlight.percent);
    set("news-uni", highlight.university);
    set("news-who", highlight.students);
    var tag = document.getElementById("news-sample");
    if (tag) tag.hidden = !highlight.sample;
  }

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
