/* SVG charts for the Canadian AI Exposure Map.
   All numbers are fixed from the cited sources. Nothing here is estimated
   unless the caption says so. Charts re-render on language switch. */
(function () {
  "use strict";

  var RED = "#d80621", INK = "#000c1f", INK65 = "rgba(0,12,31,.65)",
      INK45 = "rgba(0,12,31,.45)", TRACK = "#eceae6", GREEN = "#1c6b34";
  var SANS = "'Inter Tight','Inter',-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

  function lang() { return (window.__lang === "fr") ? "fr" : "en"; }
  function t(key) {
    var d = (window.I18N && window.I18N[lang()] && window.I18N[lang()][key]);
    return d != null ? d : ((window.I18N && window.I18N.en[key]) || key);
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* Generic horizontal bars. rows: [{label, value, suffix}] */
  function hbars(id, rows, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el) return;
    var W = 760, rowH = 46, labelW = opts.labelW || 250, valW = 64;
    var barW = W - labelW - valW - 16;
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.value; }));
    var H = rows.length * rowH + 8;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    rows.forEach(function (r, i) {
      var y = i * rowH + 8;
      var bw = Math.max(3, (r.value / max) * barW);
      var fill = r.color || RED;
      s += '<text x="0" y="' + (y + 17) + '" font-family="' + SANS + '" font-size="13.5" fill="' + INK65 + '">' + esc(r.label) + '</text>';
      s += '<rect x="' + labelW + '" y="' + y + '" width="' + barW + '" height="22" rx="11" fill="' + TRACK + '"/>';
      s += '<rect x="' + labelW + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="22" rx="11" fill="' + fill + '"/>';
      s += '<text x="' + (W - valW + 8) + '" y="' + (y + 17) + '" font-family="' + SANS + '" font-size="14" font-weight="600" fill="' + INK + '">' + esc(r.display || (r.value + (opts.suffix || ""))) + '</text>';
      if (opts.avgLine != null) {
        var ax = labelW + (opts.avgLine / max) * barW;
        s += '<line x1="' + ax + '" y1="0" x2="' + ax + '" y2="' + (H - 22) + '" stroke="' + INK45 + '" stroke-dasharray="5 4" stroke-width="1.5"/>';
        s += '<text x="' + (ax + 7) + '" y="' + (H - 4) + '" font-family="' + SANS + '" font-size="12" fill="' + INK45 + '">' + esc(opts.avgLabel) + '</text>';
      }
    });
    s += "</svg>";
    el.innerHTML = s;
  }

  /* Simple indexed line chart. series: [{label, color, dash, points:[{x,y}]}] */
  function lines(id, series, xlabels, opts) {
    opts = opts || {};
    var el = document.getElementById(id);
    if (!el) return;
    var W = 760, H = 300, padL = 52, padB = 40, padT = 24, padR = 14;
    var iw = W - padL - padR, ih = H - padT - padB;
    var ymin = opts.ymin != null ? opts.ymin : 95, ymax = opts.ymax != null ? opts.ymax : 115;
    function X(i) { return padL + (i / (xlabels.length - 1)) * iw; }
    function Y(v) { return padT + ih - ((v - ymin) / (ymax - ymin)) * ih; }
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    for (var g = ymin; g <= ymax; g += (opts.step || 5)) {
      s += '<line x1="' + padL + '" y1="' + Y(g) + '" x2="' + (W - padR) + '" y2="' + Y(g) + '" stroke="' + TRACK + '"/>';
      s += '<text x="' + (padL - 8) + '" y="' + (Y(g) + 4) + '" text-anchor="end" font-family="' + SANS + '" font-size="12" fill="' + INK45 + '">' + g + '</text>';
    }
    xlabels.forEach(function (xl, i) {
      var last = i === xlabels.length - 1;
      s += '<text x="' + (last ? (W - padR) : X(i)) + '" y="' + (H - 12) + '" text-anchor="' + (last ? "end" : "middle") + '" font-family="' + SANS + '" font-size="12" fill="' + INK45 + '">' + esc(xl) + '</text>';
    });
    series.forEach(function (se) {
      var d = se.points.map(function (p, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p).toFixed(1); }).join(" ");
      s += '<path d="' + d + '" fill="none" stroke="' + se.color + '" stroke-width="3.5" ' + (se.dash ? 'stroke-dasharray="' + se.dash + '"' : "") + ' stroke-linecap="round"/>';
      se.points.forEach(function (p, i) {
        s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p).toFixed(1) + '" r="5" fill="' + se.color + '"/>';
      });
      var lx = X(se.points.length - 1) + 10, ly = Y(se.points[se.points.length - 1]);
      var anchor = "start";
      if (lx + se.label.length * 7.2 > W - 4) { lx = W - 8; anchor = "end"; }
      s += '<text x="' + lx.toFixed(1) + '" y="' + (ly - 14) + '" text-anchor="' + anchor + '" font-family="' + SANS + '" font-size="13" font-weight="600" fill="' + se.color + '">' + esc(se.label) + '</text>';
    });
    s += "</svg>";
    el.innerHTML = s;
  }

  /* Stacked 100% bar with legend. */
  function splitBar(id, segs) {
    var el = document.getElementById(id);
    if (!el) return;
    var W = 760, H = 150;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    var x = 0;
    segs.forEach(function (sg, idx) {
      var w = (sg.value / 100) * W;
      var x1 = x.toFixed(1), w1 = w.toFixed(1);
      if (idx === 0) {
        s += '<rect x="' + x1 + '" y="8" width="' + w1 + '" height="44" rx="22" fill="' + sg.color + '"/>';
      } else if (idx === segs.length - 1) {
        s += '<path d="M ' + x1 + ' 8 H ' + (x + w - 22).toFixed(1) +
             ' A 22 22 0 0 1 ' + (x + w).toFixed(1) + ' 30 A 22 22 0 0 1 ' + (x + w - 22).toFixed(1) +
             ' 52 H ' + x1 + ' Z" fill="' + sg.color + '"/>';
      } else {
        s += '<rect x="' + x1 + '" y="8" width="' + w1 + '" height="44" fill="' + sg.color + '"/>';
      }
      s += '<text x="' + (x + w / 2).toFixed(1) + '" y="36" text-anchor="middle" font-family="' + SANS + '" font-size="16" font-weight="600" fill="#fff">' + sg.value + '%</text>';
      x += w;
    });
    var ly = 92;
    segs.forEach(function (sg) {
      s += '<rect x="0" y="' + (ly - 11) + '" width="14" height="14" rx="4" fill="' + sg.color + '"/>';
      s += '<text x="22" y="' + ly + '" font-family="' + SANS + '" font-size="13.5" fill="' + INK + '">' + esc(sg.label) + '</text>';
      ly += 24;
    });
    s += "</svg>";
    el.innerHTML = s;
  }

  /* ---- specific charts ---- */

  function renderCoverage(id) {
    var L = lang() === "fr";
    hbars(id, [
      { label: L ? "Programmeurs" : "Computer programmers", value: 74.5, display: "74.5%" },
      { label: L ? "Représentants du service à la clientèle" : "Customer service representatives", value: 70.1, display: "70.1%" },
      { label: L ? "Commis à la saisie de données" : "Data entry keyers", value: 67.1, display: "67.1%" }
    ], { max: 100, suffix: "%", labelW: 300 });
  }

  function renderWorkerUse(id) {
    var L = lang() === "fr";
    hbars(id, [
      { label: L ? "Direction et cadres supérieurs" : "Legislative and senior management", value: 75.1, display: "75.1%" },
      { label: L ? "Sciences naturelles et appliquées" : "Natural and applied sciences", value: 67.5, display: "67.5%" },
      { label: L ? "Ressources naturelles et agriculture" : "Natural resources and agriculture", value: 17.0, display: "17.0%" },
      { label: L ? "Métiers, transport, machinerie" : "Trades, transport, equipment operators", value: 14.7, display: "14.7%" }
    ], { max: 100, labelW: 300 });
  }

  function renderFirmTrend(id) {
    var L = lang() === "fr";
    lines(id, [{
      label: L ? "Entreprises utilisant l'IA" : "Firms using AI",
      color: RED,
      points: [6.1, 12.2, 19.2]
    }], ["Q2 2024", "Q2 2025", "Q2 2026"], { ymin: 0, ymax: 25, step: 5 });
  }

  function renderIndustry(id) {
    var L = lang() === "fr";
    var rows = L ? [
      { label: "Information et culture", value: 42.3, display: "42,3 %" },
      { label: "Finance et assurances", value: 40.4, display: "40,4 %" },
      { label: "Services professionnels, scientifiques et techniques", value: 32.4, display: "32,4 %" },
      { label: "Construction", value: 9.2, display: "9,2 %", color: INK },
      { label: "Agriculture, foresterie, pêche et chasse", value: 4.5, display: "4,5 %", color: INK }
    ] : [
      { label: "Information and cultural industries", value: 42.3, display: "42.3%" },
      { label: "Finance and insurance", value: 40.4, display: "40.4%" },
      { label: "Professional, scientific and technical", value: 32.4, display: "32.4%" },
      { label: "Construction", value: 9.2, display: "9.2%", color: INK },
      { label: "Agriculture, forestry, fishing and hunting", value: 4.5, display: "4.5%", color: INK }
    ];
    hbars(id, rows, { max: 50, labelW: 330 });
  }

  function renderExposureSplit(id) {
    var L = lang() === "fr";
    splitBar(id, L ? [
      { label: "Exposition faible : 40 %", value: 40, color: INK },
      { label: "Exposition élevée, l'IA assiste : 29 % (environ 3,9 M de travailleurs)", value: 29, color: GREEN },
      { label: "Exposition élevée, l'IA concurrence : 31 % (environ 4,2 M de travailleurs)", value: 31, color: RED }
    ] : [
      { label: "Low exposure: 40%", value: 40, color: INK },
      { label: "High exposure, AI augments: 29% (about 3.9M workers)", value: 29, color: GREEN },
      { label: "High exposure, AI competes: 31% (about 4.2M workers)", value: 31, color: RED }
    ]);
  }

  function renderMetro(id) {
    var L = lang() === "fr";
    var rows = [
      { label: "Toronto", value: 54, display: "54" },
      { label: "Montréal", value: 53, display: "53" },
      { label: "Ottawa", value: 51, display: "51" },
      { label: L ? "Ville de Québec" : "Quebec City", value: 51, display: "51" },
      { label: "Vancouver", value: 50, display: "50" },
      { label: L ? "Métros de ressources" : "Resource metros", value: 44.5, display: "44-45", color: INK }
    ];
    hbars(id, rows, { max: 60, avgLine: 48, avgLabel: L ? "Moyenne des métros : 48" : "Metro average: 48", labelW: 330 });
  }

  function renderSqueeze(id) {
    var L = lang() === "fr";
    lines(id, [
      { label: L ? "30 à 49 ans" : "Ages 30-49", color: RED, points: [100, 103, 106, 109, 112] },
      { label: L ? "Moins de 30 ans" : "Under 30", color: INK, dash: "7 5", points: [100, 101, 100, 101, 100] }
    ], ["2022", "2023", "2024", "2025", "2026"], { ymin: 95, ymax: 115, step: 5 });
  }

  function renderAugAuto(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var L = lang() === "fr";
    var W = 760, H = 150;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    var splitX = (0.57 * W).toFixed(1), rw = (0.43 * W).toFixed(1);
    s += '<rect x="0" y="8" width="' + W + '" height="44" rx="22" fill="' + GREEN + '"/>';
    s += '<path d="M ' + splitX + ' 8 H ' + (W - 22) + ' A 22 22 0 0 1 ' + W + ' 30 A 22 22 0 0 1 ' + (W - 22) + ' 52 H ' + splitX + ' Z" fill="' + RED + '"/>';
    s += '<text x="' + (0.285 * W).toFixed(1) + '" y="36" text-anchor="middle" font-family="' + SANS + '" font-size="16" font-weight="600" fill="#fff">57%</text>';
    s += '<text x="' + (0.785 * W).toFixed(1) + '" y="36" text-anchor="middle" font-family="' + SANS + '" font-size="16" font-weight="600" fill="#fff">43%</text>';
    s += '<rect x="0" y="66" width="14" height="14" rx="4" fill="' + GREEN + '"/>';
    s += '<text x="22" y="78" font-family="' + SANS + '" font-size="13.5" fill="' + INK + '">' + esc(L ? "Augmentation : l'IA assiste le travailleur (janv. 2025)" : "Augmentation: AI assists the worker (Jan 2025)") + '</text>';
    s += '<rect x="0" y="94" width="14" height="14" rx="4" fill="' + RED + '"/>';
    s += '<text x="22" y="106" font-family="' + SANS + '" font-size="13.5" fill="' + INK + '">' + esc(L ? "Automatisation : l'IA exécute la tâche directement" : "Automation: AI completes the task directly") + '</text>';
    s += '<text x="0" y="134" font-family="' + SANS + '" font-size="13.5" fill="' + INK65 + '">' + esc(L ? "La part des tâches automatisées de façon directive est passée de 27 % à 39 % (déc. 2024 à mars 2025)." : "The share of directively automated tasks rose from 27% to 39% (Dec 2024 to Mar 2025).") + '</text>';
    s += "</svg>";
    el.innerHTML = s;
  }

  function renderElectrician(id) {
    var L = lang() === "fr";
    hbars(id, [
      { label: L ? "Électriciens" : "Electricians", value: 13, display: "13%" },
      { label: L ? "Plombiers et tuyauteurs" : "Plumbers and pipefitters", value: 1, display: "1%", color: INK },
      { label: L ? "Couvreurs" : "Roofers", value: 1, display: "1%", color: INK }
    ], { max: 100, labelW: 260 });
  }

  function renderPostings(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var L = lang() === "fr";
    var W = 760, H = 240;
    function fmt(n) { return L ? n.toString().replace("000", " 000") : n.toLocaleString("en-US"); }
    var rows = [
      { label: "2024", value: 60000, pct: "1.6%" },
      { label: "2025", value: 129000, pct: "3.5%" }
    ];
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    rows.forEach(function (r, i) {
      var y = 20 + i * 92;
      var bw = (r.value / 129000) * 560;
      s += '<text x="0" y="' + (y + 24) + '" font-family="' + SANS + '" font-size="15" font-weight="600" fill="' + INK + '">' + r.label + '</text>';
      s += '<rect x="70" y="' + y + '" width="560" height="34" rx="17" fill="' + TRACK + '"/>';
      s += '<rect x="70" y="' + y + '" width="' + bw.toFixed(1) + '" height="34" rx="17" fill="' + RED + '"/>';
      s += '<text x="646" y="' + (y + 23) + '" font-family="' + SANS + '" font-size="14" font-weight="600" fill="' + INK + '">' + fmt(r.value) + " (" + r.pct + ")" + '</text>';
    });
    s += '<text x="0" y="222" font-family="' + SANS + '" font-size="13.5" fill="' + INK65 + '">' +
      esc(L ? "Les rôles d'utilisateurs de l'IA ont augmenté d'environ 62 000 offres." : "AI-user roles grew by about 62,000 postings.") + '</text>';
    s += "</svg>";
    el.innerHTML = s;
  }

  /* Registry: chart id -> renderer. Called on load and on language change. */
  var RENDERERS = {
    "chart-coverage": renderCoverage,
    "chart-workeruse": renderWorkerUse,
    "chart-firmtrend": renderFirmTrend,
    "chart-industry": renderIndustry,
    "chart-split": renderExposureSplit,
    "chart-metro": renderMetro,
    "chart-squeeze": renderSqueeze,
    "chart-augauto": renderAugAuto,
    "chart-electrician": renderElectrician,
    "chart-postings": renderPostings
  };

  window.renderAllCharts = function () {
    Object.keys(RENDERERS).forEach(function (id) { RENDERERS[id](id); });
  };
})();
