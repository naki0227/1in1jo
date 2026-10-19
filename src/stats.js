// ===== STATS RENDERING =====
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
function colorOf(o){
  if (o.tags.includes('human')) return 'var(--human)';
  if (o.tags.includes('prok')) return 'var(--c-prok)';
  if (o.tags.includes('protist')) return 'var(--c-prot)';
  if (o.tags.includes('plant')) return 'var(--c-plant)';
  if (o.tags.includes('domestic')) return 'var(--c-dom)';
  if (o.tags.includes('vert')) return 'var(--c-vert)';
  return 'var(--c-inv)';
}
const FILTERS = [['all','すべての生物'],['animal','動物だけ'],['insect','昆虫だけ'],['vert','脊椎動物だけ'],['mammal','哺乳類だけ'],['plant','植物だけ']];
const fname = f => (FILTERS.find(x => x[0] === f) || FILTERS[0])[1];
const HUMAN = () => ORGS.find(o => o.id === 'human');

// 対数軸 (日)
const LX = { min: Math.log10(1 / 24 / 6), max: Math.log10(1000 * Y) }; // 10分〜1000年
const TICKS = [[1/24,'1時間'],[1,'1日'],[7,'1週'],[30.44,'1か月'],[Y,'1年'],[10*Y,'10年'],[100*Y,'100年'],[1000*Y,'1000年']];

function svgSurvival(orgs, marker){
  const W = 720, H = 300, L = 84, R = 16, T = 14, B = 34;
  const ymin = -8; // 10^-8
  const xs = d => L + (Math.log10(Math.max(d, 1e-9)) - LX.min) / (LX.max - LX.min) * (W - L - R);
  const ys = p => T + (p <= 0 ? 1 : Math.min(1, -Math.log10(p) / -ymin)) * (H - T - B);
  let g = '<g class="grid">';
  TICKS.forEach(([d]) => g += `<line x1="${xs(d)}" x2="${xs(d)}" y1="${T}" y2="${H - B}"/>`);
  for (let e = 0; e >= ymin; e -= 2) g += `<line x1="${L}" x2="${W - R}" y1="${ys(10 ** e)}" y2="${ys(10 ** e)}"/>`;
  g += '</g>';
  let lab = '';
  TICKS.forEach(([d, n]) => lab += `<text x="${xs(d)}" y="${H - B + 18}" text-anchor="middle">${n}</text>`);
  const ylabs = { 0:'100%', '-2':'1%', '-4':'0.01%', '-6':'100万分の1', '-8':'1億分の1' };
  for (let e = 0; e >= ymin; e -= 2) lab += `<text x="${L - 6}" y="${ys(10 ** e) + 4}" text-anchor="end">${ylabs[e]}</text>`;
  let paths = '';
  orgs.forEach(({ o, color, width }) => {
    let d = '', N = 260;
    for (let i = 0; i <= N; i++){
      const lx = LX.min + (LX.max - LX.min) * i / N, t = 10 ** lx;
      const s = surv(o, t);
      if (s < 10 ** ymin){ d += `L${xs(t).toFixed(1)},${ys(0).toFixed(1)}`; break; }
      d += (i ? 'L' : 'M') + xs(t).toFixed(1) + ',' + ys(s).toFixed(1);
    }
    paths += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width || 2.5}" stroke-linejoin="round"/>`;
  });
  let mk = '';
  if (marker){ const sv = surv(marker.o, marker.t); const x = xs(Math.max(marker.t, 10 ** LX.min)), y = ys(Math.max(sv, 10 ** ymin));
    mk = `<circle cx="${x}" cy="${y}" r="6" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><text x="${x + (x > W - 140 ? -10 : 10)}" y="${y - 10}" text-anchor="${x > W - 140 ? 'end' : 'start'}" style="fill:var(--ink);font-weight:600">生存 ${sv >= 0.001 ? pct(sv) : sci(sv)}</text>`; }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="生存曲線">${g}${lab}${paths}${mk}</svg>`;
}

function svgHist(sample, mark){
  const W = 720, H = 220, L = 16, R = 16, T = 18, B = 34, NB = 48;
  const bins = new Array(NB).fill(0);
  sample.forEach(t => { let k = Math.floor((Math.log10(Math.max(t, 1e-6)) - LX.min) / (LX.max - LX.min) * NB); k = Math.max(0, Math.min(NB - 1, k)); bins[k]++; });
  const mx = Math.max(...bins);
  const xs = d => L + (Math.log10(d) - LX.min) / (LX.max - LX.min) * (W - L - R);
  const bw = (W - L - R) / NB;
  let g = '<g class="grid">'; TICKS.forEach(([d]) => g += `<line x1="${xs(d)}" x2="${xs(d)}" y1="${T}" y2="${H - B}"/>`); g += '</g>';
  let bars = '';
  bins.forEach((c, i) => { if (!c) return; const h = Math.max(1.5, (H - T - B) * c / mx); bars += `<rect x="${(L + i * bw + 1).toFixed(1)}" y="${(H - B - h).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${h.toFixed(1)}" fill="var(--accent)" opacity=".75"/>`; });
  let lab = ''; TICKS.forEach(([d, n]) => lab += `<text x="${xs(d)}" y="${H - B + 18}" text-anchor="middle">${n}</text>`);
  let mk = '';
  if (mark){ const x = xs(Math.max(mark.t, 10 ** LX.min)); mk = `<line x1="${x}" x2="${x}" y1="${T - 6}" y2="${H - B}" stroke="var(--human)" stroke-width="2"/><text x="${x}" y="${T - 8 + 4}" text-anchor="${x > W - 120 ? 'end' : 'start'}" dx="${x > W - 120 ? -6 : 6}" style="fill:var(--human);font-weight:600">${esc(mark.label)}</text>`; }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="命の長さの分布">${g}${bars}${lab}${mk}</svg>`;
}

function sampleLives(ws, n){
  const out = [];
  for (let i = 0; i < n; i++){ const o = draw(ws); out.push(quickLife(o)); }
  return out;
}
// 寿命だけを速く引く
function quickLife(o){
  let t = 0;
  for (const st of o.stages){
    if (st.final === 'exp'){ return t + Math.min(expS(st.d), st.max); }
    if (st.final === 'fixed'){ const j = st.j || 0, L = st.d * (1 - j + 2 * j * rng()); return t + (rng() < st.s ? L : L * rng()); }
    if (rng() < st.s) t += st.d * (0.85 + 0.3 * rng()); else return t + st.d * rng();
  }
  return t;
}

// 地球の直径の帯に並べたときの幅
const SCALES = [[1.7e-15,'陽子の直径'],[1e-10,'原子1個'],[1e-7,'ウイルス1個'],[1e-6,'細菌1個'],[8e-5,'髪の毛の太さ'],[1e-3,'1mm'],[0.02,'1円玉の直径'],[1.7,'ヒトの身長'],[3776,'富士山の高さ']];
function scaleText(m){
  let best = SCALES[0];
  for (const s of SCALES) if (m >= s[0] * 0.5) best = s;
  const r = m / best[0];
  if (r >= 0.8 && r < 1.5) return `${best[1]}くらい`;
  return r >= 1 ? `${best[1]}の約${jp(r)}倍` : `${best[1]}の約${jp(1 / r)}分の1`;
}
