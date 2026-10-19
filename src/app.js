// ===== PLAYER =====
const ui = {};
const PRED_RE = /食べ|襲|捕食|狩|捕ま|釣り|漁|かかった|寄生|ハチ/;
const STARVE_RE = /飢|餓|餌|不足|エネルギー/;
const QUESTIONS = [
  'あなたが今日食べたもののなかに、この生き物の仲間はいましたか？',
  'この一生とあなたの一生。時間の流れは、どれくらい違って感じられるでしょう。',
  'あなたがここまで生きてこられた理由を、ひとつ挙げるとしたら？',
  'この生き物に名前をつけるとしたら、どんな名前にしますか？',
  'あなたのきょうだいや、幼いころの友だちをひとり思い浮かべてみてください。',
  'もしあなたがこの生き物として生まれていたら、何がいちばん怖かったと思いますか？',
  'いま、窓の外にいる生き物は何でしょう。',
];
let P = null;
const track = (name, data) => { try { window.va && window.va('event', { name, data }); } catch (e){} };
const probText = p => p >= 0.01 ? pct(p) : oneIn(p);

function initUI(){
  ['setup','slot','slot-name','slot-p','birth','player','ending','record','go'].forEach(id => ui[id] = document.getElementById(id));
  document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', () => { state.mode = r.value; renderAll(); updateHeroOdds(); }));
  document.getElementById('filter').addEventListener('change', e => { state.filter = e.target.value; renderAll(); updateHeroOdds(); });
  ui.go.addEventListener('click', startBirth);
  document.getElementById('again').addEventListener('click', () => { document.getElementById('top').scrollIntoView({ behavior:'smooth' }); setTimeout(startBirth, 350); });
  document.getElementById('ctl-pause').addEventListener('click', togglePause);
  document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => { P && (P.speed = +b.dataset.speed); syncSpeed(); }));
  document.getElementById('ctl-next').addEventListener('click', () => { if (P) P.skipTo = true; if (P && !P.playing) togglePause(); });
  document.getElementById('ctl-auto').addEventListener('click', () => { if (!P) return; P.auto = !P.auto; syncSpeed(); });
  document.getElementById('ctl-end').addEventListener('click', () => { if (P && P.alive){ P.speed = 4096; P.auto = true; P.skipTo = true; if (!P.playing) togglePause(); } });
  renderPast();
}

// ---------- 出生の抽選 ----------
function startBirth(){
  if (P && P.raf) cancelAnimationFrame(P.raf);
  const ws = weights(state.mode, state.filter);
  const org = draw(ws), p = ws.list.find(x => x.o === org).p;
  state.name = (document.getElementById('name').value || '').trim() || 'あなた';
  state.lenMin = +document.querySelector('input[name=len]:checked').value;
  ['birth','player','ending','record'].forEach(k => ui[k].hidden = true);
  ui.slot.hidden = false;
  ui.slot.scrollIntoView({ behavior:'smooth', block:'center' });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = reduce ? 1 : 22; let k = 0;
  const spin = () => {
    const o = k < steps - 1 ? draw(ws) : org, x = ws.list.find(y => y.o === o);
    ui['slot-name'].textContent = o.name;
    ui['slot-p'].textContent = `確率 ${x.p >= 0.001 ? pct(x.p) : oneIn(x.p)}`;
    k++;
    if (k < steps) setTimeout(spin, 40 + 0.9 * k * k); else setTimeout(() => showBirth(org, p, ws), reduce ? 200 : 900);
  };
  spin();
}

function pickPlace(o){ return o.place ? pickW(Object.fromEntries(o.place)) : '—'; }
function mrz(o){
  const s = (o.sci || o.id).toUpperCase().replace(/[^A-Z ]/g, '').split(' ');
  const a = ('S<' + (s[0] || 'X') + '<<' + (s[1] || '') + '<'.repeat(40)).slice(0, 36);
  const b = (String(Math.floor(Math.log10(o.N))).padStart(2, '0') + 'N' + (o.group.length) + 'X' + Math.round(o.e0) + '<'.repeat(40)).slice(0, 36);
  return a + '\n' + b;
}

function showBirth(org, p, ws){
  ui.slot.hidden = true;
  state.me = org; state.life = null;
  const place = pickPlace(org);
  const peers = []; for (let i = 0; i < 4; i++){ const o = draw(ws); peers.push({ o, place: pickPlace(o), life: live(o) }); }
  P = { org, p, ws, place, peers, t:0, si:-1, alive:true, focus:'normal', speed:1, auto:false, playing:false, log:[], sched:[], offspring:0, repros:0,
        sibN:Math.max(0, (org.clutch || 1) - 1), decisions:0, autoDecisions:0, act:0, calm:0, fc:0, written:[], hitoiki:0, skipTo:false, lastFrame:0, mapH:refLife(org) };
  P.sibAlive = P.sibN;
  P.scale = refLife(org) * 0.6 / (state.lenMin * 60); // 生物の日数 / 実時間の秒
  const h = HUMAN(), ofs = org.births / 365 / 86400;
  const sameYear = org.births;
  document.getElementById('b-no').textContent = 'No. ' + org.id.toUpperCase() + '-' + Math.floor(Math.random() * 9e6 + 1e6);
  document.getElementById('b-name').textContent = state.name;
  document.getElementById('b-species').textContent = org.name;
  document.getElementById('b-sci').textContent = (org.sci ? org.sci + ' · ' : '') + org.group;
  document.getElementById('b-mrz').textContent = mrz(org);
  const summary = `${place === '—' ? '' : place + 'で、'}${org.name}として生まれました。` +
    (P.sibN ? `同じときに生まれたきょうだいは${P.sibN >= 1e4 ? '約' + jp(P.sibN) : P.sibN}${org.tags.includes('vert') && org.tags.includes('mammal') ? '頭' : ''}。` : '') +
    (org.rep ? `（${org.rep}）` : '');
  document.getElementById('b-summary').textContent = summary;
  const rows = [
    ['生まれた場所', place], ['分類', org.group], ['体の大きさ', org.size || '—'],
    ['この種に生まれる確率', `${probText(p)}（${modeName(state.mode).replace('で選ぶ', '')}・${fname(state.filter)}）`],
    ['地球上の仲間の数', `約${jp(org.N)}（${sci(org.N)}）`],
    ['1年に生まれる仲間', `約${jp(org.births)}`],
    ['平均寿命（生まれた時点）', dur(org.e0)],
    [org.r0 === 'divide' ? '分裂までたどり着く確率' : `${org.adultName}までたどり着く確率`, org.pAdult >= 0.001 ? pct(org.pAdult) : oneIn(org.pAdult)],
  ];
  if (org.fec) rows.push(['子の数', org.fec]);
  document.getElementById('b-rows').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  const cmp = [
    ['平均寿命', dur(org.e0), dur(h.e0), '84年'],
    ['おとなになる確率', org.pAdult >= 0.001 ? pct(org.pAdult) : oneIn(org.pAdult), pct(h.pAdult), '99%以上'],
    ['1年に生まれる数', jp(org.births), jp(h.births), '約73万'],
    ['地球上の数', jp(org.N), jp(h.N), '約1.2億'],
  ];
  document.getElementById('b-compare').innerHTML = `<thead><tr><th></th><th>${esc(org.name)}</th><th>ヒト（世界平均）</th><th>日本のヒト</th></tr></thead><tbody>` + cmp.map(r => `<tr><th>${r[0]}</th>${r.slice(1).map(c => `<td class="n">${c}</td>`).join('')}</tr>`).join('') + '</tbody>';
  document.getElementById('b-fact').textContent = org.r0 === 'divide'
    ? `いまこの1秒に、地球ではあなたの仲間が約${jp(ofs)}個生まれています。数が安定しているなら、分裂までたどり着けるのはちょうど半分です。`
    : `いまこの1秒に、地球ではあなたの仲間が約${jp(ofs)}${ofs < 10 ? '' : ''}生まれています。同じ年に生まれる約${jp(sameYear)}の仲間のうち、${org.adultName}までたどり着くのは約${jp(sameYear * org.pAdult)}。`;
  document.getElementById('b-peers').innerHTML = peers.map(x => `<li><b>${esc(x.o.name)}</b><span>${esc(x.place)}</span></li>`).join('');
  renderScene(document.getElementById('b-scene'), { scene: sceneOf(org, place, org.stages[0].name), sprite: spriteOf(org, org.stages[0].name), sibs: P.sibN, frame: 0 });
  ui.birth.hidden = false;
  ui.birth.scrollIntoView({ behavior:'smooth', block:'start' });
  track('born', { species: org.name, group: org.group, mode: state.mode, filter: state.filter });
  document.getElementById('b-start').onclick = beginLife;
  const bt = tweetBirth();
  document.getElementById('x-birth').href = xUrl(bt);
  document.getElementById('x-birth').onclick = () => track('share', { where: 'birth', to: 'x' });
  const bcv = document.getElementById('card-birth'); drawCard(bcv, 'birth', {}); document.fonts && document.fonts.ready.then(() => drawCard(bcv, 'birth', {}));
  document.getElementById('img-birth').onclick = () => saveCard(bcv, bt);
  renderDist(); renderSurv(); renderLadder(); drawHist();
}

function refLife(o){
  let t = 0; for (const st of o.stages){ if (st.final === 'exp') t += Math.min(st.d * 1.5, st.max); else t += st.d; }
  return Math.max(t, 1 / 24);
}

// ---------- 一生 ----------
function beginLife(){
  ui.birth.hidden = true; ui.player.hidden = false;
  ui.player.scrollIntoView({ behavior:'smooth', block:'start' });
  const o = P.org;
  document.getElementById('p-species').textContent = o.name;
  document.getElementById('p-name').textContent = state.name;
  document.getElementById('p-place').textContent = P.place;
  document.getElementById('p-mrz').textContent = mrz(o);
  document.getElementById('p-group').textContent = o.group;
  document.getElementById('p-log').innerHTML = '';
  document.getElementById('p-map').innerHTML = '';
  addLog(0, 'birth', `${P.place === '—' ? '' : P.place + 'で、'}${o.name}として生まれました。` + (P.sibN ? `きょうだいは${P.sibN >= 1e4 ? '約' + jp(P.sibN) : P.sibN}。` : ''), `この種に生まれる確率は${probText(P.p)}`);
  enterStage(0);
  P.playing = true; syncSpeed();
  P.lastFrame = performance.now();
  P.raf = requestAnimationFrame(frame);
}

function stageMul(){
  const f = P.focus;
  if (f === 'hide') return { h:0.75, d:1.2 };
  if (f === 'forage') return { h:1.3, d:0.8 };
  if (f === 'dormant') return { h:0.5, d:2.5 };
  if (f === 'breed') return { h:1.12, d:1 };
  if (f === 'rest') return { h:0.92, d:1 };
  return { h:1, d:1 };
}
function enterStage(i){
  const o = P.org, st = o.stages[i];
  P.si = i; P.stStart = P.t;
  const j = st.j || 0;
  P.stEnd = st.final === 'exp' ? P.t + st.max : st.final === 'fixed' ? P.t + st.d * (1 - j + 2 * j * rng()) : null;
  P.stDur = st.final ? null : st.d * (0.9 + 0.2 * rng());
  P.stProg = 0;
  const span = st.final === 'exp' ? st.d * 1.6 : st.final === 'fixed' ? (P.stEnd - P.t) : P.stDur;
  (st.lines || []).forEach(line => P.sched.push({ t: P.t + span * (0.08 + 0.85 * rng()), kind:'line', text: line }));
  if (st.final && o.repro && o.r0 !== 'managed' && o.r0 !== 'social'){
    const iv = o.lpy ? Y / o.lpy : st.d < Y ? st.d * 0.5 : Y;
    const first = st.final === 'fixed' ? (P.stEnd - P.t) * 0.85 : Math.min(iv, st.d * 0.3);
    P.nextRepro = P.t + first; P.reproIv = st.final === 'fixed' ? Infinity : iv;
  } else P.nextRepro = Infinity;
  if (i > 0) addLog(P.t, 'stage', `${st.name}になりました。`, stageFact(i));
  else addLog(P.t, 'stage', `${st.name}としての時間が始まりました。`, stageFact(i));
  P.sched.sort((a, b) => a.t - b.t);
  if (o.r0 === 'managed') P.focus = 'normal';
  // 決断とひと息
  if (i > 0 && o.r0 !== 'managed') queueHitoiki(i);
  if (o.r0 !== 'managed' && (i > 0 || o.r0 === 'divide')) queueDecision(i);
}
function stageFact(i){
  const o = P.org, st = o.stages[i], reach = o.reach[i];
  if (st.final === 'exp') return `同じ瞬間に生まれた仲間のうち、ここまで来られたのは${reach >= 0.001 ? pct(reach) : oneIn(reach)}。この段階の平均の長さは${dur(st.d)}。`;
  if (st.final === 'fixed') return `この段階の長さは約${dur(st.d)}。最後までたどり着くのは約${pct(st.s)}。`;
  return `この段階（約${dur(st.d)}）を生きのびるのは${st.s >= 0.001 ? pct(st.s) : oneIn(st.s)}。` + (i > 0 ? `ここまで来られた仲間は${reach >= 0.001 ? pct(reach) : oneIn(reach)}。` : '');
}
function hazard(){
  const st = P.org.stages[P.si], m = stageMul();
  if (st.final === 'exp') return m.h / st.d;
  if (st.final === 'fixed') return -Math.log(Math.max(1e-9, st.s)) / st.d * m.h;
  return -Math.log(Math.max(1e-12, st.s)) / st.d * m.h;
}
function frame(now){
  if (!P || !P.alive) return;
  const dtReal = Math.min(0.1, (now - P.lastFrame) / 1000); P.lastFrame = now;
  if (P.playing && !P.modal){
    let dt = dtReal * P.scale * P.speed * (P.skipTo ? 400 : 1);
    step(dt);
  }
  draw_();
  if (P.alive) P.raf = requestAnimationFrame(frame);
}
function step(dt){
  const o = P.org;
  let guard = 0;
  while (dt > 0 && P.alive && !P.modal && guard++ < 400){
    const st = o.stages[P.si], m = stageMul();
    let limit = dt;
    const stageLeft = st.final ? (P.stEnd - P.t) : (P.stDur * m.d - P.stProg);
    limit = Math.min(limit, Math.max(1e-6, stageLeft));
    if (P.sched.length) limit = Math.min(limit, Math.max(1e-6, P.sched[0].t - P.t));
    if (P.nextRepro < Infinity) limit = Math.min(limit, Math.max(1e-6, P.nextRepro - P.t));
    const h = hazard();
    const pDie = 1 - Math.exp(-h * limit);
    if (rng() < pDie){
      const x = rng() * limit; advance(x); return die(pickCause(st)); }
    advance(limit); dt -= limit;
    if (!st.final) P.stProg += limit;
    while (P.sched.length && P.sched[0].t <= P.t + 1e-9){ const e = P.sched.shift(); addLog(e.t, e.kind, e.text); }
    if (P.t >= P.nextRepro - 1e-9) doRepro();
    if (st.final === 'exp' && P.t >= P.stEnd - 1e-9) return die('寿命を全うした');
    if (st.final === 'fixed' && P.t >= P.stEnd - 1e-9) return die(st.endCause);
    if (!st.final && P.stProg >= P.stDur * m.d - 1e-9){
      if (P.si + 1 < o.stages.length){ P.focus = P.focus === 'dormant' ? 'normal' : P.focus === 'breed' ? 'normal' : P.focus; enterStage(P.si + 1); if (P.skipTo && P.modal) P.skipTo = false; }
      else return divide();
    }
  }
}
function advance(x){
  const o = P.org, t0 = P.t; P.t += x;
  if (P.sibAlive > 0){
    const s0 = surv(o, t0), s1 = surv(o, P.t), r = s0 > 0 ? s1 / s0 : 0;
    if (P.sibAlive < 200){ let a = 0; for (let i = 0; i < P.sibAlive; i++) if (rng() < r) a++; P.sibAlive = a; }
    else { const mu = P.sibAlive * r, sd = Math.sqrt(Math.max(0, mu * (1 - r))); P.sibAlive = Math.max(0, Math.round(mu + sd * (rng() + rng() + rng() - 1.5) * 2)); }
  }
}
function pickCause(st){
  const c = Object.assign({}, st.causes || { 'その他':1 });
  const f = P.focus;
  for (const k in c){
    if (f === 'hide'){ if (PRED_RE.test(k)) c[k] *= 0.5; if (STARVE_RE.test(k)) c[k] *= 1.8; }
    if (f === 'forage'){ if (PRED_RE.test(k)) c[k] *= 1.5; if (STARVE_RE.test(k)) c[k] *= 0.5; }
  }
  return pickW(c);
}
function doRepro(){
  const o = P.org;
  if (P.focus === 'rest'){ addLog(P.t, 'line', '今年は繁殖を見送り、体を休めました。'); P.focus = 'normal'; }
  else {
    const n = Math.max(1, Math.round(o.reproN || (o.clutch || 1)));
    P.repros++; P.offspring += n;
    addLog(P.t, 'repro', `${o.repro}（${P.repros}回目）`, `生まれた子：${n >= 1e4 ? '約' + jp(n) : n}。統計どおりなら、このうち${o.stages[0] ? '' : ''}${o.adultName}まで育つのは約${fmtCount(n * o.pAdult)}。`);
    if (P.focus === 'breed') P.focus = 'normal';
  }
  P.nextRepro = P.t + P.reproIv;
  if (P.reproIv < Infinity && P.repros >= 1 && P.repros % 2 === 1 && P.org.stages[P.si].final === 'exp') queueBreedDecision();
}
function fmtCount(x){ return x >= 10 ? jp(Math.round(x)) + (P.org.tags.includes('mammal') ? '頭' : '') : x >= 1 ? x.toFixed(1) : x >= 0.01 ? x.toFixed(2) : sci(x); }

// ---------- 決断 ----------
function queueDecision(i){
  const o = P.org, st = o.stages[i];
  if (P.skipTo){ P.skipTo = false; }
  let d;
  if (o.r0 === 'divide'){
    if (rng() < 0.6) return;
    d = { title:'まわりの栄養が薄くなってきた', body:`細菌の多くは、条件が悪くなると代謝を落として休眠します。地下や海底の微生物では、分裂までに数百年かかることもあります。`,
      opts:[['dormant','休眠して待つ','死ぬ危険 ↓ ・分裂までの時間 ↑'],['forage','残った栄養で分裂を急ぐ','分裂が早まる ・危険 ↑'],['normal','流れにまかせる','変化なし']] };
  } else if (st.final){
    if (o.r0 === 'social'){ d = { title:'仕事の割り当て', body:'働きアリ・働きバチの仕事は、年齢とともに巣の中から外へ移っていきます。外での仕事は危険が大きい。', opts:[['hide','巣の中の仕事を続ける','危険 ↓'],['forage','早めに外で餌を集める','危険 ↑ ・巣への貢献 ↑'],['normal','仲間の流れに合わせる','変化なし']] }; }
    else d = { title:`${st.name}になった。どう生きる？`, body:`おとなの平均の寿命は約${dur(st.d)}。おとなになってからの死因でいちばん多いのは「${topCause(st)}」です。`,
      opts:[['hide','用心深く暮らす','死ぬ危険 ↓ ・食べる量 ↓'],['forage','たくさん食べて体を大きくする','体力 ↑ ・危険 ↑'],['normal','本能にまかせる','変化なし']] };
  } else {
    d = { title:`${st.name}の時期をどう過ごす？`, body:`この時期を生きのびるのは${st.s >= 0.001 ? pct(st.s) : oneIn(st.s)}。死因でいちばん多いのは「${topCause(st)}」。`,
      opts:[['hide','隠れて、じっとしている','この時期を生きのびる確率 ↑ ・育つのが遅くなる'],['forage','よく食べて、早く育つ','早く次の段階へ ・危険 ↑'],['normal','本能にまかせる','変化なし']] };
  }
  P.pendingDecision = d;
}
function queueBreedDecision(){
  const o = P.org;
  P.pendingDecision = { title:'繁殖の季節が、またやって来た', body:`子を残すことは、体にとって大きな負担です。それでも、数が安定した種では、親が一生に残す子のうちおとなになるのは平均で2匹です。`,
    opts:[['breed','繁殖する','子を残す ・危険 ↑'],['rest','今回は見送って体を休める','危険 ↓ ・子は残さない'],['normal','本能にまかせる','繁殖する']] };
}
function topCause(st){ const c = st.causes || {}; return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || 'その他'; }
function showModal(kind, d){
  P.modal = kind;
  const box = document.getElementById('p-modal');
  box.hidden = false;
  if (kind === 'decision'){
    box.innerHTML = `<div class="m-kind">決断</div><h3>${esc(d.title)}</h3><p class="m-body">${esc(d.body)}</p><div class="m-opts">` +
      d.opts.map((o, i) => `<button class="m-opt" data-v="${o[0]}"><span class="m-num">${i + 1}</span><span><b>${esc(o[1])}</b><small>${esc(o[2])}</small></span></button>`).join('') +
      `</div><p class="m-note">変わるのは確率だけです。結果は統計の中で決まります。</p>` + (P.auto ? '<p class="m-auto" id="m-auto">まもなく「本能にまかせる」に進みます</p>' : '');
    box.querySelectorAll('.m-opt').forEach(b => b.addEventListener('click', () => { P.decisions++; chooseFocus(b.dataset.v, d.opts.find(x => x[0] === b.dataset.v)[1]); }));
    if (P.auto) P.autoTimer = setTimeout(() => { P.autoDecisions++; P.decisions++; chooseFocus('normal', '本能にまかせる'); }, P.speed > 64 ? 50 : 2200);
    box.querySelector('.m-opt').focus({ preventScroll:true });
  } else if (kind === 'hitoiki'){
    box.innerHTML = `<div class="m-kind">ひと息</div><h3>${esc(d.title)}</h3><p class="m-body">${esc(d.body)}</p><p class="m-q">${esc(d.q)}</p>
      <div class="m-write"><input type="text" id="m-input" maxlength="60" placeholder="一行だけ、書き残せます（なくても大丈夫）"><button class="btn small" id="m-ok">続ける</button></div>`;
    const go = () => { const v = document.getElementById('m-input').value.trim(); if (v){ P.written.push({ t:P.t, text:v, stage:P.org.stages[P.si].name }); addLog(P.t, 'written', `「${v}」`); } closeModal(); };
    document.getElementById('m-ok').addEventListener('click', go);
    document.getElementById('m-input').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    if (P.auto) P.autoTimer = setTimeout(go, P.speed > 64 ? 50 : 3500);
  }
}
function chooseFocus(v, label){
  clearTimeout(P.autoTimer);
  P.focus = v;
  if (['forage','breed'].includes(v)) P.act++; if (['hide','dormant','rest'].includes(v)) P.calm++;
  addLog(P.t, 'decision', `決めたこと：${label}`);
  closeModal();
}
function closeModal(){
  clearTimeout(P.autoTimer);
  const box = document.getElementById('p-modal'); box.hidden = true; box.innerHTML = '';
  P.modal = null; P.lastFrame = performance.now();
  maybeModal();
}
function queueHitoiki(i){
  if (P.hitoiki >= 2) return;
  const o = P.org, reach = o.reach[i];
  if (reach > 0.7 && i < o.stages.length - 1 && o.r0 !== 'divide') return;
  P.hitoiki++;
  const pr = HUMAN();
  const sib = P.sibN ? `きょうだい${P.sibN >= 1e4 ? '約' + jp(P.sibN) : P.sibN}のうち、まだ生きているのは${fmtSib(P.sibAlive)}。` : '';
  P.pendingHitoiki = { title:`${dur(P.t)}。${o.stages[i].name}になりました`,
    body:`同じ瞬間に生まれた仲間のうち、ここまで来られたのは${reach >= 0.001 ? pct(reach) : oneIn(reach)}。${sib}ヒトなら、同じ年に生まれた人の${pct(surv(pr, P.t))}が${dur(P.t)}の時点で生きています。`,
    q: QUESTIONS[Math.floor(rng() * QUESTIONS.length)] };
}
function fmtSib(n){ return n >= 1e4 ? '約' + jp(n) : n + ''; }
function maybeModal(){
  if (!P || !P.alive || P.modal) return;
  if (P.pendingHitoiki){ const d = P.pendingHitoiki; P.pendingHitoiki = null; P.skipTo = false; showModal('hitoiki', d); return; }
  if (P.pendingDecision){ const d = P.pendingDecision; P.pendingDecision = null; P.skipTo = false; showModal('decision', d); }
}

// ---------- 終わり ----------
function divide(){
  P.alive = false;
  addLog(P.t, 'divide', P.org.endSurvive);
  finishLife(P.org.endSurvive, true);
}
function die(cause){
  P.alive = false;
  addLog(P.t, 'death', `${dur(P.t)}で一生を終えました。`, `（${cause}）`);
  finishLife(cause, false);
}
function finishLife(cause, divided){
  draw_();
  const o = P.org;
  state.life = { life:P.t, cause, divided };
  const longer = P.t > 0 ? surv(o, P.t) : 1;
  const allLonger = histCache ? 1 - lowerBound(histCache, P.t) / histCache.length : null;
  const end = ui.ending;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = [
    `最後の時、${divided ? '分裂の瞬間' : '生後' + dur(P.t)}`,
    divided ? `${o.endSurvive}。あなたはもう、どこにもいません。そして2つになりました。` : `${P.place === '—' ? '' : P.place + 'で、'}${o.name}として一生を終えました。`,
    divided ? '' : `（${cause}）`,
  ];
  const timeline = P.log.filter(e => ['stage','repro','decision','written','line'].includes(e.kind) && (e.kind !== 'line' || e.star)).slice(-8);
  end.innerHTML = `<div class="e-inner">${lines.filter(Boolean).map((l, i) => `<p class="e-l" style="animation-delay:${reduce ? 0 : i * 0.9}s">${esc(l)}</p>`).join('')}
    <div class="e-reel" style="animation-delay:${reduce ? 0 : 2.6}s">${timeline.slice(-6).map(e => `<figure><img src="${sceneImg(e.t)}" alt=""><figcaption><i>${esc(dur(e.t))}</i>${esc(e.text)}</figcaption></figure>`).join('')}</div>
    <div class="e-tomb" style="animation-delay:${reduce ? 0 : 3.6}s"><b>${esc(state.name)}</b><span>${esc(o.name)}${o.sci ? ' · ' + esc(o.sci) : ''}</span>
    <span>${esc(dur(P.t))}を生きました${P.t >= 2 ? `（日数にすると約${jp(Math.round(P.t))}日）` : ''}。</span>
    ${P.written.length ? `<em>“${esc(P.written[0].text)}” ${esc(P.written[0].stage)}のあなたが残した思い</em>` : ''}
    <span>${esc(heroOneIn())}の、たった一度きりの命でした。</span></div>
    <button class="btn" id="e-rec" style="animation-delay:${reduce ? 0 : 4.4}s">記録を見る</button></div>`;
  ui.ending.hidden = false;
  ui.ending.scrollIntoView({ behavior:'smooth', block:'center' });
  document.getElementById('e-rec').addEventListener('click', () => { ui.ending.hidden = true; showRecord(cause, divided, longer, allLonger); });
  track('life_end', { species: o.name, divided: !!divided });
  savePast({ name:state.name, sp:o.name, life:P.t, cause, at:Date.now(), p:P.p });
}
function lowerBound(a, x){ let lo = 0, hi = a.length; while (lo < hi){ const m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; }

function showRecord(cause, divided, longer, allLonger){
  const o = P.org, rec = ui.record;
  const peers = P.peers.map(x => ({ name:x.o.name, place:x.place, life:x.life.life, cause:x.life.cause, me:false }));
  peers.push({ name:o.name + '（' + state.name + '）', place:P.place, life:P.t, cause, me:true });
  peers.sort((a, b) => a.life - b.life);
  const kids = P.offspring;
  const bio = `${P.place === '—' ? '' : P.place + 'で'}${o.name}として生まれた。` +
    (P.sibN ? `きょうだい${fmtSib(P.sibN)}のうち、最後まで一緒に生きていたのは${fmtSib(P.sibAlive)}。` : '') +
    (P.si > 0 ? `${o.stages.slice(0, P.si + 1).map(s => s.name).join('、')}と育ち、` : '') +
    (divided ? `生後${dur(P.t)}で分裂して2つになった。` : `生後${dur(P.t)}で世を去った（${cause}）。`) +
    (kids ? `残した子は${kids >= 1e4 ? '約' + jp(kids) : kids}。統計どおりなら、そのうちおとなになるのは約${fmtCount(kids * o.pAdult)}。` : '');
  const facts = [
    ['生きた時間', dur(P.t)],
    ['最後の段階', o.stages[P.si].name],
    [divided ? '一生の終わり' : '死因', divided ? '分裂' : cause],
    ['同じ種で、あなたより長く生きる割合', longer >= 0.001 ? pct(longer) : oneIn(longer)],
    ['すべての生き物の中で、あなたより長く生きる割合', allLonger == null ? '—' : pct(allLonger)],
    ['残した子', kids ? (kids >= 1e4 ? '約' + jp(kids) : kids) : '0'],
    ['決断の回数', `${P.decisions}回（うち${P.autoDecisions}回は本能まかせ）`],
    ['ヒトの平均寿命と比べると', P.t < HUMAN().e0 ? `約${jp(HUMAN().e0 / Math.max(P.t, 1e-3))}分の1` : `約${(P.t / HUMAN().e0).toFixed(1)}倍`],
  ];
  rec.innerHTML = `<div class="r-head"><span class="eyebrow">RECORD OF LIFE · 生涯の記録</span><h2>${esc(state.name)}　${esc(o.name)}</h2><p>${esc(bio)}</p></div>
    <div class="r-facts">${facts.map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>
    ${texBlock(cause, divided)}
    <div class="r-peers"><h3>同じ1秒に生まれた5つの命</h3><ol>${peers.map(x => `<li class="${x.me ? 'me' : ''}"><b>${esc(x.name)}</b><span>${esc(x.place)}</span><span class="mono">${esc(dur(x.life))}</span><span class="muted">${esc(x.cause)}</span></li>`).join('')}</ol>
    <p class="small muted">誰も、どの生き物に生まれるかを選んではいません。</p></div>
    <div class="r-share"><canvas class="card-prev" id="card-end" width="1200" height="630" aria-label="シェア用の画像"></canvas><p id="share-text">${esc(shareText(cause, divided, peers))}</p>
    <div class="go-row share-row"><a class="btn xbtn" id="x-end" target="_blank" rel="noopener">𝕏 でポスト</a><a class="btn" id="line-end" target="_blank" rel="noopener">LINEで送る</a><button class="btn" id="img-end">画像を保存</button><button class="btn" id="share2">文章をコピー</button><span class="toast" id="toast2" role="status"></span></div>
    <div class="go-row"><button class="btn primary" id="again2">もう一度生まれる</button></div></div>`;
  rec.hidden = false;
  rec.scrollIntoView({ behavior:'smooth', block:'start' });
  document.getElementById('share2').addEventListener('click', copyShare);
  const endTxt = tweetEnd(cause, divided);
  document.getElementById('x-end').href = xUrl(endTxt);
  document.getElementById('x-end').addEventListener('click', () => track('share', { where: 'end', to: 'x' }));
  document.getElementById('line-end').addEventListener('click', () => track('share', { where: 'end', to: 'line' }));
  document.getElementById('line-end').href = lineUrl(endTxt);
  const cv = document.getElementById('card-end'); drawCard(cv, 'end', { cause, divided }); document.fonts && document.fonts.ready.then(() => drawCard(cv, 'end', { cause, divided }));
  document.getElementById('img-end').addEventListener('click', () => saveCard(cv, endTxt));
  document.getElementById('again2').addEventListener('click', () => { document.getElementById('top').scrollIntoView({ behavior:'smooth' }); setTimeout(startBirth, 400); });
  renderSurv(); drawHist(); renderPast();
}
function texBlock(cause, divided){
  const o = P.org, tx = textureOf(o, P.t, { divided, kids: P.offspring, act: P.act, calm: P.calm });
  const share = textureShare(P.ws, tx.key, 12000);
  P.tex = tx;
  return `<div class="tex"><div><span class="eyebrow">この一生の手ざわり</span><div class="tname">${esc(tx.name)}</div><p class="tdesc">${esc(tx.desc)}</p>
    <p class="small muted">いまの設定で生まれる命のうち、約${share >= 0.001 ? pct(share) : '0.1%未満'}がこの手ざわりで一生を終えます。人ではなく、一度の一生につく名前です。どの手ざわりも、ほかよりすぐれているわけではありません。</p></div>
    <div>${AXES.map((ax, i) => `<div class="axis"><b>${ax[0]}</b><span class="ax" title="${esc(ax[3])}"><span class="${tx.bits[i] ? '' : 'on'}">${ax[0]}</span><span class="${tx.bits[i] ? 'on' : ''}">${ax[1]}</span></span><b>${ax[1]}</b></div>`).join('')}
    <div class="tex-all">${Object.keys(TEX).map(k => `<span class="${k === tx.key ? 'on' : ''}">${esc(TEX[k][0])}</span>`).join('')}</div>
    <p class="small muted">瞬／永：${esc(AXES[0][3])}。孤／群：${esc(AXES[1][3])}。凪／波：${esc(AXES[2][3])}。還／継：${esc(AXES[3][3])}。</p></div></div>`;
}
const SITE = 'https://1in1jo.enludus.com/', TAG = '110穣分の1';
function xUrl(text){ return 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(SITE) + '&hashtags=' + encodeURIComponent(TAG); }
function lineUrl(text){ return 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(SITE) + '&text=' + encodeURIComponent(text); }
function tweetBirth(){
  const o = P.org;
  return `わたしは${probText(P.p)}の確率で、${P.place === '—' ? '' : P.place + 'の'}${o.name}に生まれた。` +
    (o.r0 === 'divide' ? '分裂までたどり着けるのは50%。' : `同じ年に生まれた仲間のうち、${o.adultName}までたどり着くのは${o.pAdult >= 0.001 ? pct(o.pAdult) : oneIn(o.pAdult)}。`) + 'あなたは何に生まれる？';
}
function tweetEnd(cause, divided){
  const o = P.org;
  return `${probText(P.p)}の確率で${o.name}に生まれ、` + (divided ? `${dur(P.t)}で分裂して2つになった。` : `${dur(P.t)}で一生を終えた（${cause}）。`) +
    (P.tex ? `この一生の手ざわりは「${P.tex.name}」。` : '') + 'あなたは何に生まれる？';
}
function wrapText(c, text, x, y, maxW, lh, maxLines){
  let line = '', lines = [];
  for (const ch of text){ if (c.measureText(line + ch).width > maxW && line){ lines.push(line); line = ch; } else line += ch; }
  if (line) lines.push(line);
  if (maxLines && lines.length > maxLines){ lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…'; }
  lines.forEach((l, i) => c.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}
function drawCard(cv, kind, opt){
  const c = cv.getContext('2d'), o = P.org;
  c.fillStyle = '#0c1312'; c.fillRect(0, 0, 1200, 630);
  const stn = kind === 'end' ? o.stages[P.si].name : o.stages[0].name;
  const sc = document.createElement('canvas'); sc.width = PW; sc.height = PH;
  renderScene(sc, { scene: sceneOf(o, P.place, stn), sprite: spriteOf(o, stn), sibs: kind === 'end' ? Math.min(P.sibAlive, 6) : Math.min(P.sibN, 6), frame: 12, divided: opt.divided });
  c.imageSmoothingEnabled = false; c.drawImage(sc, 56, 150, 576, 240);
  c.strokeStyle = '#2c3936'; c.lineWidth = 2; c.strokeRect(56, 150, 576, 240);
  const disp = '"Shippori Mincho B1", serif', body = '"Zen Kaku Gothic New", sans-serif', mono = '"JetBrains Mono", monospace';
  c.fillStyle = '#4fc2b1'; c.font = `700 30px ${disp}`; c.fillText('110穣分の1', 56, 84);
  c.fillStyle = '#93a5a0'; c.font = `500 20px ${body}`; c.fillText(kind === 'end' ? '生涯の記録' : '出生届', 56, 118);
  c.fillStyle = '#93a5a0'; c.font = `400 20px ${body}`; c.fillText(P.place === '—' ? '' : P.place, 56, 426);
  c.fillStyle = '#e2ece9'; c.font = `400 22px ${body}`; c.fillText(state.name, 680, 120);
  c.font = `800 ${o.name.length > 12 ? 40 : 54}px ${disp}`;
  let y = wrapText(c, o.name, 680, 186, 470, o.name.length > 12 ? 50 : 64, 2);
  c.font = `400 22px ${body}`; c.fillStyle = '#93a5a0';
  y = wrapText(c, `この種に生まれる確率 ${probText(P.p)}`, 680, y + 12, 470, 34);
  c.fillStyle = '#e2ece9'; c.font = `600 28px ${body}`;
  if (kind === 'end'){
    y = wrapText(c, opt.divided ? `${dur(P.t)}で分裂した` : `${dur(P.t)}を生きた`, 680, y + 24, 470, 40);
    c.font = `400 22px ${body}`; c.fillStyle = '#93a5a0'; if (!opt.divided) y = wrapText(c, `（${opt.cause}）`, 680, y, 470, 32, 2);
    if (P.tex){ c.fillStyle = '#f06aa6'; c.font = `700 30px ${disp}`; y = wrapText(c, `手ざわり「${P.tex.name}」`, 680, y + 26, 500, 40, 2); }
  } else {
    y = wrapText(c, o.r0 === 'divide' ? '分裂できる確率 50%' : `${o.adultName}になれる確率 ${o.pAdult >= 0.001 ? pct(o.pAdult) : oneIn(o.pAdult)}`, 680, y + 24, 470, 40, 2);
    c.font = `400 22px ${body}`; c.fillStyle = '#93a5a0'; y = wrapText(c, `平均寿命 ${dur(o.e0)}`, 680, y + 4, 470, 32);
    c.fillStyle = '#f06aa6'; c.font = `700 28px ${disp}`; wrapText(c, 'この命は、どこまで生きられるだろう？', 680, y + 30, 470, 38, 2);
  }
  c.fillStyle = '#2c3936'; c.fillRect(56, 552, 1088, 2);
  c.fillStyle = '#93a5a0'; c.font = `400 20px ${body}`; c.fillText('地球上のすべての生き物から、ひとつの命を引く', 56, 596);
  c.textAlign = 'right'; c.font = `400 20px ${mono}`; c.fillText(SITE.replace('https://', '').replace(/\/$/, ''), 1144, 596); c.textAlign = 'left';
}
function saveCard(cv, text){
  const t = document.getElementById('toast2') || document.getElementById('toast-b');
  cv.toBlob(blob => {
    if (!blob) return;
    const file = new File([blob], '110jo.png', { type:'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files:[file] })){ navigator.share({ files:[file], text: text + ' #' + TAG + ' ' + SITE }).catch(() => {}); return; }
    } catch (e){}
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '110jo.png'; document.body.appendChild(a); a.click(); a.remove();
    if (t) t.textContent = '保存できない場合は、画像を長押し（右クリック）して保存してください';
  }, 'image/png');
}
function heroOneIn(){ const ws = weights(state.mode, state.filter); return jp(ws.W) + '分の1'; }
function shareText(cause, divided, peers){
  const o = P.org;
  const others = peers.filter(x => !x.me).map(x => `${x.name}は${dur(x.life)}`).join('、');
  return `わたしは${probText(P.p)}の確率で、${P.place === '—' ? '' : P.place + 'の'}${o.name}に生まれた。` +
    (divided ? `${dur(P.t)}で分裂して、2つになった。` : `${dur(P.t)}生きて、${cause.replace(/た$/, 'て')}一生を終えた。`.replace('てて', 'て')) +
    `手ざわりは「${P.tex ? P.tex.name : ''}」。同じ1秒に生まれた${others}を生きた。あなたは、何に生まれるだろう？ #${TAG} ${SITE}`;
}
function copyShare(){
  const el = document.getElementById('share-text'); if (!el) return;
  const txt = el.textContent, t = document.getElementById('toast2');
  const done = () => { if (t) t.textContent = 'コピーしました'; };
  try { navigator.clipboard.writeText(txt).then(done, () => { selectText(el); if (t) t.textContent = '選択しました。コピーしてください'; }); }
  catch (e){ selectText(el); }
}
function selectText(el){ const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }

// ---------- 表示 ----------
function addLog(t, kind, text, sub){
  const e = { t, kind, text, sub }; P.log.push(e);
  const li = document.createElement('li'); li.className = kind;
  li.innerHTML = `<span class="t">${esc(dur(t))}</span><span><span class="tx">${esc(text)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}</span>`;
  li.tabIndex = 0;
  const toggle = () => { e.star = !e.star; li.classList.toggle('star', e.star); };
  li.addEventListener('click', toggle); li.addEventListener('keydown', ev => { if (ev.key === 'Enter') toggle(); });
  const ul = document.getElementById('p-log'); ul.insertBefore(li, ul.firstChild);
  if (kind === 'stage' || kind === 'repro' || kind === 'decision' || kind === 'death' || kind === 'divide') markMap(t, kind);
  if (kind === 'stage' || kind === 'decision') setTimeout(maybeModal, 0);
}
function markMap(t, kind){ (P.marks = P.marks || []).push({ t, kind }); }
function draw_(){
  if (!P) return;
  const o = P.org, st = o.stages[P.si] || o.stages[0];
  document.getElementById('p-age').textContent = P.t < 1e-3 ? '0分' : dur(P.t);
  document.getElementById('p-stage').textContent = P.alive ? st.name : (state.life && state.life.divided ? '分裂' : '一生を終えた');
  const S = surv(o, P.t);
  document.getElementById('p-cohort').textContent = S >= 0.001 ? pct(S) : oneIn(S);
  document.getElementById('p-sib').textContent = P.sibN ? `${fmtSib(P.sibAlive)} / ${fmtSib(P.sibN)}` : 'ひとりっ子';
  document.getElementById('p-focus').textContent = ({ normal:'本能にまかせる', hide:'用心深く', forage:'よく食べる', dormant:'休眠', breed:'繁殖', rest:'体を休める' })[P.focus];
  document.getElementById('p-kids').textContent = P.offspring ? (P.offspring >= 1e4 ? '約' + jp(P.offspring) : P.offspring) : '0';
  // ゲージ
  const prog = st.final ? 1 : Math.min(1, (P.si + P.stProg / (P.stDur * stageMul().d)) / Math.max(1, o.stages.length - 1));
  const hz = hazard() * Math.max(1, P.stDur || st.d);
  const danger = Math.min(1, 1 - Math.exp(-hz));
  setGauge('g-grow', prog); setGauge('g-danger', danger);
  setGauge('g-food', P.focus === 'forage' ? 0.85 : P.focus === 'hide' ? 0.35 : P.focus === 'dormant' ? 0.15 : 0.6);
  // 進捗
  const H = P.mapH; if (P.t > H) P.mapH = H * 2;
  document.getElementById('p-bar').style.width = Math.min(100, P.t / P.mapH * 100) + '%';
  document.getElementById('p-rate').textContent = `実時間1秒 ≈ ${dur(P.scale * P.speed)}`;
  drawMap(); drawPeers(); drawMiniSurv();
  P.fc++;
  if (P.fc % 3 === 0 || !P.alive){
    const stn = P.alive ? st.name : o.stages[P.si].name, scene = sceneOf(o, P.place, stn);
    renderScene(document.getElementById('p-scene'), { scene, sprite: spriteOf(o, stn), sibs: P.sibN ? P.sibAlive : (o.r0 === 'divide' ? 6 : 0), frame: P.fc / 3, dead: !P.alive, divided: state.life && state.life.divided && !P.alive });
    document.getElementById('p-scene-cap').textContent = `${P.place === '—' ? '' : P.place + ' · '}${SCENE_JA[scene] || ''} · ${P.sibN ? 'きょうだい ' + fmtSib(P.sibAlive) + ' と一緒に' : o.r0 === 'divide' ? 'まわりには数えきれない仲間' : 'ひとりで'}`;
  }
}
function sceneImg(t){
  const o = P.org; const ev = P.log.filter(e => e.kind === 'stage' && e.t <= t + 1e-9).pop();
  const stn = ev ? o.stages.find(s => ev.text.startsWith(s.name))?.name || o.stages[0].name : o.stages[0].name;
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
  renderScene(cv, { scene: sceneOf(o, P.place, stn), sprite: spriteOf(o, stn), sibs: Math.min(P.sibN, 4), frame: t * 7 % 100 });
  return cv.toDataURL();
}
function setGauge(id, v){ const el = document.getElementById(id); el.style.width = (v * 100).toFixed(0) + '%'; el.parentElement.nextElementSibling.textContent = Math.round(v * 100); }
let lastMapKey = '';
function drawMap(){
  const H = P.mapH, n = Math.min(100, Math.floor(P.t / H * 100) + 1);
  const key = n + ':' + H + ':' + (P.marks ? P.marks.length : 0) + ':' + P.alive;
  if (key === lastMapKey) return; lastMapKey = key;
  const o = P.org; let html = '';
  const e0cell = Math.min(99, Math.floor(o.e0 / H * 100));
  for (let i = 0; i < 100; i++){
    const t = (i + 0.5) * H / 100;
    let cls = 'c';
    if (i < n){ let si = 0, acc = 0; for (let k = 0; k < o.stages.length; k++){ if (P.log.some(e => e.kind === 'stage' && e.t <= t && e.text.startsWith(o.stages[k].name))) si = k; } cls += ' s' + (si % 4); }
    if (i === e0cell) cls += ' e0';
    const mk = (P.marks || []).filter(m => Math.min(99, Math.floor(m.t / H * 100)) === i).map(m => m.kind);
    const sym = mk.includes('death') ? '†' : mk.includes('divide') ? '÷' : mk.includes('repro') ? '♥' : mk.includes('decision') ? '◆' : '';
    html += `<i class="${cls}">${sym}</i>`;
  }
  document.getElementById('p-map').innerHTML = html;
  document.getElementById('p-map-note').textContent = `1マス = ${dur(H / 100)} · 枠のマス = 生まれた時点の平均寿命`;
}
function drawPeers(){
  const t = P.t;
  document.getElementById('p-peers').innerHTML = P.peers.map(x => {
    const L = x.life;
    let st;
    if (t < L.life){ const ev = L.events.filter(e => e.kind === 'stage' && e.t <= t).pop(); st = `<span class="ok">${esc(ev ? ev.text : '生まれたばかり')}</span>`; }
    else st = `<span class="gone">${esc(dur(L.life))}で${L.divided ? '分裂' : '死去'}</span><small>${esc(L.cause)}</small>`;
    return `<li><span><b>${esc(x.o.name)}</b><small>${esc(x.place)}</small></span><span class="st">${st}</span></li>`;
  }).join('');
}
let miniKey = '';
function drawMiniSurv(){
  const k = Math.round(Math.log10(Math.max(P.t, 1e-3)) * 20);
  if (k === miniKey) return; miniKey = k;
  document.getElementById('p-surv').innerHTML = svgSurvival([{ o: HUMAN(), color:'var(--human)', width:1.5 }, { o: P.org, color:'var(--accent)', width:3 }], P.t > 0 ? { o:P.org, t:P.t } : null);
}
function togglePause(){ if (!P) return; P.playing = !P.playing; P.lastFrame = performance.now(); syncSpeed(); }
function syncSpeed(){
  if (!P) return;
  document.getElementById('ctl-pause').textContent = P.playing ? '一時停止' : '再開';
  document.querySelectorAll('[data-speed]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.speed === P.speed));
  document.getElementById('ctl-auto').setAttribute('aria-pressed', P.auto);
}

// ---------- 前世の記録 ----------
function savePast(r){ try { const a = JSON.parse(localStorage.getItem('jo-lives') || '[]'); a.unshift(r); localStorage.setItem('jo-lives', JSON.stringify(a.slice(0, 10))); } catch (e){} }
function renderPast(){
  let a = []; try { a = JSON.parse(localStorage.getItem('jo-lives') || '[]'); } catch (e){}
  const el = document.getElementById('past');
  if (!a.length){ el.innerHTML = '<p class="small muted">まだありません。生まれ直すたびに、直近10回の一生がこのブラウザにだけ残ります。</p>'; return; }
  el.innerHTML = '<ol>' + a.map(r => `<li><b>${esc(r.sp)}</b><span class="mono">${esc(dur(r.life))}</span><span class="muted">${esc(r.cause)}</span></li>`).join('') + '</ol>';
}

// ---------- ヒーロー ----------
function updateHeroOdds(){
  const ws = weights(state.mode, state.filter);
  const s = jp(ws.W);
  const m = s.match(/^([\d.,]+)(.*)$/);
  document.getElementById('hero-num').innerHTML = m ? `${m[1]}<span class="u">${m[2]}</span><span class="bun">分の1</span>` : s + '<span class="bun">分の1</span>';
  document.getElementById('hero-sci').textContent = `${fname(state.filter)}・${modeName(state.mode)}：${sci(ws.W)}${state.mode === 'births' ? '（1年あたり）' : ''}`;
}
let heroStart = performance.now();
function tickCounter(){
  const sec = (performance.now() - heroStart) / 1000;
  const all = weights('births', 'all').W / Y / 86400, hu = HUMAN().births / Y / 86400;
  document.getElementById('cnt-all').textContent = jp(all * sec, 3);
  document.getElementById('cnt-hu').textContent = Math.floor(hu * sec).toLocaleString('ja-JP');
  setTimeout(tickCounter, 250);
}
