// ===== MODEL =====
function stageMean(st){
  if (st.final === 'exp') return st.d * (1 - Math.exp(-st.max / st.d));
  if (st.final === 'fixed') return st.d * (st.s + (1 - st.s) / 2);
  return st.d * (1 + st.s) / 2;
}
function prepare(o){
  const reach = []; let P = 1;
  o.stages.forEach((st, i) => { reach[i] = P; if (!st.final) P *= st.s; });
  o.reach = reach; o.pEnd = P; // pEnd: 最後の非最終ステージまで生き延びる確率（原核生物では分裂確率）
  const E = o.stages.map(stageMean);
  o.e0 = E.reduce((a, e, i) => a + reach[i] * e, 0);
  const c = o.count || 0;
  let Ec = 0; for (let j = c; j < E.length; j++) Ec += (reach[j] / reach[c]) * E[j];
  const entriesPerYear = o.birthsAtCount || (o.N / Ec * Y);
  o.births = o.birthsOverride || entriesPerYear / reach[c];
  const ai = o.adultIdx != null ? o.adultIdx : o.stages.findIndex(s => s.final);
  o.pAdult = ai >= 0 ? reach[ai] : P;
  o.adultName = ai >= 0 ? o.stages[ai].name : '分裂';
  o.maxLife = o.stages.reduce((a, st) => a + (st.final === 'exp' ? st.max : st.final === 'fixed' ? st.d * (1 + (st.j || 0)) : st.d), 0);
}
ORGS.forEach(prepare);

// 生存関数 S(t)（解析的）
function surv(o, t){
  let t0 = 0;
  for (let i = 0; i < o.stages.length; i++){
    const st = o.stages[i], P = o.reach[i];
    if (st.final === 'exp'){ const x = t - t0; return x >= st.max ? 0 : P * Math.exp(-x / st.d); }
    if (st.final === 'fixed'){
      const x = t - t0, j = st.j || 0, d = st.d;
      const F1 = j === 0 ? (x < d ? 1 : 0) : Math.min(1, Math.max(0, (d * (1 + j) - x) / (2 * d * j)));
      return P * (st.s * F1 + (1 - st.s) * Math.max(0, 1 - x / d));
    }
    if (t < t0 + st.d) return P * (1 - (1 - st.s) * (t - t0) / st.d);
    t0 += st.d;
  }
  return 0; // 最後まで行った = 分裂
}

function rng(){ return Math.random(); }
function pickW(obj){
  const ks = Object.keys(obj); let tot = 0; ks.forEach(k => tot += obj[k]);
  let r = rng() * tot; for (const k of ks){ r -= obj[k]; if (r <= 0) return k; } return ks[ks.length - 1];
}
function expS(m){ return -m * Math.log(1 - rng()); }

// 一生をシミュレート
function live(o){
  const ev = []; let t = 0;
  const addLines = (st, from, to, frac) => {
    if (!st.lines || !st.lines.length) return;
    const pool = st.lines.slice();
    const k = Math.min(pool.length, to - from > 0 ? 1 + (rng() < 0.6 ? 1 : 0) : 0);
    for (let n = 0; n < k; n++){
      const line = pool.splice(Math.floor(rng() * pool.length), 1)[0];
      const at = from + (to - from) * (0.15 + 0.7 * rng()) * (frac == null ? 1 : frac);
      ev.push({ t: at, kind: 'line', text: line });
    }
  };
  for (let i = 0; i < o.stages.length; i++){
    const st = o.stages[i];
    ev.push({ t, kind: 'stage', text: st.name, idx: i });
    if (st.final === 'exp'){
      let L = expS(st.d), cause;
      if (L >= st.max){ L = st.max * (0.97 + 0.03 * rng()); cause = '寿命を全うした'; } else cause = pickW(st.causes);
      addLines(st, t, t + L);
      if (o.repro && L > st.d * 0.15) ev.push({ t: t + L * (0.2 + 0.4 * rng()), kind: 'repro', text: o.repro });
      t += L; ev.push({ t, kind: 'death', text: cause, idx: i });
      return finish(o, ev, t, cause, i);
    }
    if (st.final === 'fixed'){
      const j = st.j || 0, Lend = st.d * (1 - j + 2 * j * rng());
      if (rng() < st.s){ addLines(st, t, t + Lend); t += Lend; ev.push({ t, kind: 'death', text: st.endCause, idx: i }); return finish(o, ev, t, st.endCause, i); }
      const L = Lend * rng(), cause = pickW(st.causes);
      addLines(st, t, t + L); t += L; ev.push({ t, kind: 'death', text: cause, idx: i }); return finish(o, ev, t, cause, i);
    }
    if (rng() < st.s){
      const L = st.d * (0.85 + 0.3 * rng()); addLines(st, t, t + L); t += L;
    } else {
      const L = st.d * rng(), cause = pickW(st.causes);
      addLines(st, t, t + L); t += L; ev.push({ t, kind: 'death', text: cause, idx: i });
      return finish(o, ev, t, cause, i);
    }
  }
  ev.push({ t, kind: 'divide', text: o.endSurvive });
  return finish(o, ev, t, o.endSurvive, o.stages.length - 1, true);
}
function finish(o, ev, t, cause, idx, divided){
  ev.sort((a, b) => a.t - b.t);
  return { org: o, events: ev, life: t, cause, stageIdx: idx, divided: !!divided };
}

// 重み
function inFilter(o, f){
  if (f === 'all') return true;
  if (f === 'multi') return o.tags.includes('multi');
  if (f === 'insect') return o.tags.includes('insect');
  if (f === 'plant') return o.tags.includes('plant');
  if (f === 'animal') return o.tags.includes('animal');
  if (f === 'vert') return o.tags.includes('vert');
  if (f === 'mammal') return o.tags.includes('mammal');
  return true;
}
function weights(mode, f){
  const list = ORGS.filter(o => inFilter(o, f)).map(o => ({ o, w: mode === 'births' ? o.births : o.N }));
  const W = list.reduce((a, x) => a + x.w, 0);
  list.forEach(x => x.p = x.w / W);
  list.sort((a, b) => b.w - a.w);
  return { list, W };
}
function draw(ws){
  let r = rng();
  for (const x of ws.list){ r -= x.p; if (r <= 0) return x.o; }
  return ws.list[ws.list.length - 1].o;
}

// ===== FORMAT =====
const UNITS = ['', '万', '億', '兆', '京', '垓', '秭', '穣', '溝', '澗', '正'];
function jp(x, sig = 2){
  if (x < 1e4) return (x < 10 ? +x.toPrecision(sig) : Math.round(x)).toLocaleString('ja-JP');
  let k = Math.floor(Math.log10(x) / 4); if (k >= UNITS.length) k = UNITS.length - 1;
  let v = x / Math.pow(10, 4 * k);
  let s = v >= 1000 ? Math.round(v).toLocaleString('ja-JP') : (+v.toPrecision(sig)).toString();
  return s + UNITS[k];
}
const SUP = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };
function sci(x, sig = 2){
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -2 && e < 4) return (+x.toPrecision(sig)).toLocaleString('ja-JP');
  let m = x / Math.pow(10, e); m = +m.toPrecision(sig);
  if (m >= 10){ m = +(m / 10).toPrecision(sig); e += 1; }
  return (m === 1 ? '' : m + '×') + '10' + String(e).split('').map(c => SUP[c]).join('');
}
function pct(p){
  if (p >= 0.995) return '99%以上';
  if (p >= 0.1) return Math.round(p * 100) + '%';
  if (p >= 0.01) return (p * 100).toFixed(1) + '%';
  if (p >= 0.0001) return (p * 100).toPrecision(2) + '%';
  return sci(p) ;
}
function oneIn(p){ return jp(1 / p) + '分の1'; }
function dur(days){
  const m = days * 1440;
  if (m < 1) return '1分未満';
  if (m < 60) return Math.round(m) + '分';
  const h = days * 24;
  if (h < 24) return Math.floor(h) + '時間' + (h < 10 ? Math.round((h % 1) * 60) + '分' : '');
  if (days < 60) return Math.floor(days) + '日' + (days < 10 ? Math.floor((days % 1) * 24) + '時間' : '');
  if (days < 730) return (days < 365 ? Math.round(days / 30.44) + 'か月' : '1年' + Math.round((days - 365) / 30.44) + 'か月');
  const y = days / Y;
  if (y < 100) return Math.floor(y) + '年' + (y < 20 ? Math.floor((y % 1) * 12) + 'か月' : '');
  return Math.round(y).toLocaleString('ja-JP') + '年';
}
