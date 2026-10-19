// ===== RENDER STATS =====
const state = { mode: 'stock', filter: 'all', me: null, life: null };
const modeName = m => m === 'births' ? '1年に生まれる数で選ぶ' : 'いま生きている数で選ぶ';

function renderHuman(){
  const h = HUMAN();
  $('#hu-mode').textContent = modeName(state.mode);
  const fs = ['all','animal','vert','mammal'];
  $('#hu-cards').innerHTML = fs.map(f => {
    const ws = weights(state.mode, f), x = ws.list.find(x => x.o === h);
    return `<div class="card${f === state.filter ? ' on' : ''}"><span class="k">${fname(f)}から</span><span class="v">${oneIn(x.p)}</span><span class="s">${sci(1 / x.p)}</span></div>`;
  }).join('');
  const ws = weights(state.mode, 'all'), p = ws.list.find(x => x.o === h).p;
  const coin = Math.log2(1 / p), jumbo = Math.log(1 / p) / Math.log(2e7);
  const width = 12742e3 * p;
  $('#hu-compare').innerHTML = `
    <div><span class="muted small">コインを投げて表が出続ける回数にすると</span><b>${Math.round(coin)}回連続</b><span class="small">すべての生物から1つ引いてヒトになる確率と同じ</span></div>
    <div><span class="muted small">年末ジャンボ1等（2000万分の1）なら</span><b>${jumbo.toFixed(1)}回連続</b><span class="small">で当たるのと同じくらい</span></div>
    <div><span class="muted small">地球の直径の帯を全生物で分けると、ヒトの幅は</span><b>${sci(width)} m</b><span class="small">${scaleText(width)}</span></div>`;
}

function renderDist(){
  const ws = weights(state.mode, state.filter);
  const lo = Math.log10(ws.list[ws.list.length - 1].w), hi = Math.log10(ws.list[0].w);
  const h = HUMAN();
  $('#dist').innerHTML = ws.list.map(x => {
    const w = 4 + 96 * (Math.log10(x.w) - lo) / Math.max(1e-9, hi - lo);
    const cls = (state.me && x.o === state.me ? ' me' : '') + (x.o === h ? ' hu' : '');
    return `<div class="drow${cls}" title="${esc(x.o.name)}：${esc(x.o.rep)}"><span class="nm">${esc(x.o.name)}</span><span class="track"><i style="width:${w.toFixed(1)}%;background:${colorOf(x.o)}"></i></span><span class="pv">${x.p >= 0.001 ? pct(x.p) : oneIn(x.p)}</span></div>`;
  }).join('');
  $('#dist-strip').innerHTML = ws.list.filter(x => x.p > 0.0005).map(x => `<i style="width:${(x.p * 100).toFixed(2)}%;background:${colorOf(x.o)}" title="${esc(x.o.name)} ${pct(x.p)}"></i>`).join('');
  const hx = ws.list.find(x => x.o === h);
  $('#strip-note').textContent = hx ? `この帯の幅を1kmにしても、ヒトの幅は${sci(hx.p * 1000)} m（${scaleText(hx.p * 1000)}）。` : '';
}

let histCache = null;
function renderLife(){
  const ws = weights(state.mode, state.filter);
  const n = 20000, sample = sampleLives(ws, n).sort((a, b) => a - b);
  histCache = sample;
  const mean = ws.list.reduce((a, x) => a + x.p * x.o.e0, 0);
  const med = sample[Math.floor(n / 2)];
  const pDay = sample.filter(t => t < 1).length / n, pYear = sample.filter(t => t >= Y).length / n;
  $('#life-kpis').innerHTML = `
    <div><b>${dur(mean)}</b><span>平均寿命（期待値）</span></div>
    <div><b>${dur(med)}</b><span>中央値（半分はこれより早く終わる）</span></div>
    <div><b>${pct(pDay)}</b><span>1日以内に一生を終える</span></div>
    <div><b>${pct(pYear)}</b><span>1年以上生きる</span></div>`;
  drawHist();
}
function drawHist(){
  if (!histCache) return;
  const mark = state.life ? { t: state.life.life, label: (state.name || 'あなた') + '：' + dur(state.life.life) } : null;
  $('#life-hist').innerHTML = svgHist(histCache, mark);
}

function renderSurv(){
  const h = HUMAN();
  let list;
  if (state.me && state.me !== h) list = [{ o: h, color: 'var(--human)' }, { o: state.me, color: 'var(--accent)', width: 3.5 }];
  else list = [{ o: h, color: 'var(--human)', width: 3.5 }];
  const extra = ['cod', 'seaturtle', 'songbird', 'sar11'].map(id => ORGS.find(o => o.id === id)).filter(o => o !== state.me);
  extra.slice(0, 3).forEach(o => list.unshift({ o, color: 'var(--muted)', width: 1.5 }));
  $('#surv-chart').innerHTML = svgSurvival(list);
  $('#surv-legend').innerHTML = list.slice().reverse().map(x => `<span style="--c:${x.color}">${esc(x.o.name)}</span>`).join('');
}

function renderLadder(){
  const ids = ['human','whale','elephant','bat','cattle','songbird','lizard','rodent','spider','oithona','salmon','seaturtle','squid','tree','frog','anchovy','cod','mussel'];
  const list = ids.map(id => ORGS.find(o => o.id === id));
  if (state.me && !list.includes(state.me) && state.me.r0 !== 'divide') list.push(state.me);
  list.sort((a, b) => b.pAdult - a.pAdult);
  $('#ladder').innerHTML = list.map(o => {
    const w = 4 + 96 * (Math.log10(o.pAdult) + 6) / 6;
    const cls = (state.me && o === state.me ? ' me' : '') + (o.id === 'human' ? ' hu' : '');
    return `<div class="drow${cls}"><span class="nm">${esc(o.name)}</span><span class="track"><i style="width:${Math.max(2, w).toFixed(1)}%;background:${colorOf(o)}"></i></span><span class="pv">${o.pAdult >= 0.001 ? pct(o.pAdult) : oneIn(o.pAdult)}</span></div>`;
  }).join('') + '<p class="small muted">「おとな」は、成体・成木など最後の段階にたどり着く確率。ヒトは15歳まで生きる確率です。</p>';
}

function renderTable(){
  $('#n-orgs').textContent = ORGS.length;
  const rows = ORGS.slice().sort((a, b) => b.N - a.N).map(o => `<tr><td>${esc(o.name)}<br><span class="muted">${esc(o.group)}</span></td><td class="n">${sci(o.N)}</td><td class="n">${sci(o.lo)}〜${sci(o.hi)}</td><td class="n">${sci(o.births)}</td><td class="n">${dur(o.e0)}</td><td class="n">${o.pAdult >= 0.001 ? pct(o.pAdult) : sci(o.pAdult)}</td><td class="src">${esc(o.src)}</td></tr>`).join('');
  $('#data-table').innerHTML = `<thead><tr><th>生き物</th><th>個体数 N</th><th>幅</th><th>出生数／年</th><th>平均寿命</th><th>おとなになる確率</th><th>出典・根拠</th></tr></thead><tbody>${rows}</tbody>`;
}

function renderAll(){ renderHuman(); renderDist(); renderLife(); renderSurv(); renderLadder(); }
