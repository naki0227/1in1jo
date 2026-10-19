// ===== PIXEL SCENES =====
const PW = 192, PH = 80;
const SPR = {
  cell:['  kkkkk   ','  kbbbbbk ','kkblbbbbbk~','  kbbbbbk ','  kkkkk   '],
  protist:[' k  kkk ','  kkbbbk','kkbblbbbk',' kbbbebbk','  kbbbbk ','   kkkk  '],
  egg:[' kk ','kwwk','kwlk',' kk '],
  seed:[' kk ','knnk','knnk',' kk '],
  sprout:[' g g ','  g  ',' gg  ','  n  '],
  fish:['   kkkk    ',' kkbbbbk  k','kebbbbbbkbk','kbblbbbbbbk',' kkbbbbk  k','   kkkk    '],
  tiny:[' kk  ','kebkk','kbbbk',' kk  '],
  shark:['      k       ','     kbk      ',' kkkkbbbkkk  k','kebbbbbbbbbkbk','kbllllbbbbbbbk',' kkkkkkkkkk  k'],
  whale:['         kkkk     ','  kkkkkkkbbbbkk  k',' kbbbbbbbbbbbbbkbk','kebbbbbbbbbbbbbbk ',' kllllllllbbbbkk  ','  kkkkkkkkkkkk    '],
  crust:['k      ',' k kkk ','  kbbbk','kkbbbbbk',' kbbebk ','  kbbk  ',' k k k  '],
  worm:['  kkk   kkk ',' kbbbkkkbbbk','kbk  kbbk ek','     kk  kk '],
  insect:[' k   k ','  k k  ',' kbbbk ','kbblbbk','kbbbbbk',' kbbbk ','k k k k'],
  spider:['k k   k k',' k kbk k ','  kbbbk  ',' k kek k ','k k   k k'],
  jelly:['  kkkk  ',' kbbbbk ','kbllbbbk','kkkkkkkk',' b b b b','b b b b '],
  octo:['  kkk  ',' kbbbk ',' kebek ',' kbbbk ','kb b bk','b b b b'],
  squid:['  kk   ','  kbk  ',' kbbbk ',' kbbbk ',' kebek ','  b b  ',' b b b '],
  bird:['  kk     ',' kebk    ','ykbbbkkk ',' kbbbbbbk','  kbbbbk ','   y  y  '],
  chick:['  rr     ',' kkk     ','ykebk    ',' kbbbkkk ',' kbbbbbbk','  kbbbbk ','   y  y  '],
  penguin:[' kkk ','kbebk','ykwwbk',' kwwbk',' kwwbk','  kkk ',' y  y'],
  mouse:['   kk    ','  kbbkkk ',' kbbbbbek','kbbbbbbbk','~kbbbbbk ',' k k  k k'],
  quad:['        kk ','       kbbk',' kkkkkkkbek','kbbbbbbbbk ','kbbbbbbbbk ',' kbbbbbbk  ',' k k  k k  ',' k k  k k  '],
  bat:['k   kk   k','kk kbbk kk','kbbbbebbbk',' kb kk bk ','  k    k  '],
  human:[' kk ','kbbk',' kk ','kwwk','kwwk',' kk ','k  k'],
  primate:['  kk  ',' kbbk ',' kebk ','kbbbbk','b kk b',' k  k '],
  turtle:['   kkkk    ','  kggggk   ',' kggggggkk ','kbkkkkkkbek',' b    b    '],
  snake:['      kk ','     kbek',' kkk kbk ','kbbbkbk  ','kb kbk   ',' kk      '],
  lizard:['         kk ','kkkk  kkkbek','   kbbbbbbk ','    k  k k  '],
  frog:[' kk  kk ','kekkkkek','kbbbbbbk','kbllllbk','kb kk bk'],
  tadpole:['  kkk ','kkbebk','  kbbk','   kk '],
  tree:['    gggg    ','  gggggggg  ',' ggglgggggg ','gggggggglggg',' gggggggggg ','  gggggggg  ','     nn     ','     nn     ','     nn     ','    nnnn    '],
  conifer:['     g     ','    ggg    ','   ggggg   ','    ggg    ','  ggggggg  ',' ggggggggg ','    ggg    ',' ggggggggggg','     n     ','     n     '],
  herb:['  r r  ','  ryr  ','  rgr  ',' g g g ','  ggg  ','   g   '],
  grass:['g  g  g','g g g g',' ggggg ',' ggggg ','  ggg  '],
};
const SPC = { // 体色 [b, l]
  cell:['#8bbf5a','#cfe9a8'], protist:['#5fb39a','#b9e6d6'], fish:['#7f9fc4','#dfe8f2'], tiny:['#c8d8e8','#fff'], shark:['#6d7f94','#e8eef4'], whale:['#3f5872','#dfe7ee'],
  crust:['#e09a5c','#f7d2a8'], worm:['#c97a7a','#e8b4b4'], insect:['#7a6a3a','#c9b67a'], spider:['#4a4038','#9a8a7a'], jelly:['#d9a6e0','#f5e4f8'], octo:['#c96a4a','#f0b89a'], squid:['#e6c0b0','#fff'],
  bird:['#a07850','#e8d2b0'], chick:['#f2efe6','#fff'], penguin:['#2a2e36','#fff'], mouse:['#8a7a6a','#d8c8b8'], quad:['#9a6a3a','#d8b48a'], bat:['#4a3a3a','#8a7a7a'], human:['#d8a07a','#fff'],
  primate:['#6a4a2a','#c8a07a'], turtle:['#8a8a5a','#c8c890'], snake:['#6a8a3a','#b8d07a'], lizard:['#7a9a4a','#c8e08a'], frog:['#5a9a4a','#b8e08a'], tadpole:['#3a3a3a','#888'],
  egg:['#f2efe6','#fff'], seed:['#8a6a3a','#c8a87a'], sprout:['#5aa04a','#a8e08a'], tree:['#4a8a3a','#8acc6a'], conifer:['#2f6a3a','#5a9a5a'], herb:['#5aa04a','#e86a8a'], grass:['#7aa04a','#c8e08a'],
};
const BGS = {
  ocean:{ top:'#5fa8d8', bot:'#1f4f7a', floor:null, bubbles:true },
  deep:{ top:'#0b1830', bot:'#03070f', snow:true, glow:true },
  seafloor:{ top:'#0e2238', bot:'#081322', layers:['#3a3226','#2e281f','#241f19','#1c1814'] },
  rock:{ top:'#3a332c', bot:'#211d19', strata:true },
  soil:{ top:'#6a4a30', bot:'#3a2818', roots:true, pebbles:true, grassTop:true },
  gut:{ top:'#e3a0a0', bot:'#b05a6a', folds:true },
  face:{ top:'#e8c0a0', bot:'#c8907a', pores:true },
  forest:{ sky:'#a8d0e8', ground:'#3e6a32', trees:'#2f5a2a', canopy:true },
  jungle:{ sky:'#8cc0a8', ground:'#2e5a2a', trees:'#1f4a22', canopy:true, dense:true },
  grass:{ sky:'#b8d8f0', ground:'#c8b060', acacia:true },
  desert:{ sky:'#f0d8a8', ground:'#e0c080', dunes:true },
  fresh:{ sky:'#a8d0e0', water:'#4a8aa0', bottom:'#4a5a3a', reeds:true, bubbles:true },
  ice:{ sky:'#d8e8f4', ground:'#f4f8fb', water:'#3a6a8a' },
  farm:{ wall:'#c8b090', floor:'#a89070', indoor:true },
  city:{ sky:'#b8c8d8', ground:'#8a8a8a', buildings:true },
  cave:{ top:'#2a2420', bot:'#120f0d', stal:true },
  tundra:{ sky:'#c8d8e8', ground:'#8a9a7a' },
};
function sceneOf(o, place, stageName){
  const p = place || '';
  if (/腸|胃/.test(p)) return 'gut';
  if (/顔/.test(p)) return 'face';
  if (/鶏舎|養鶏|ふ化|ふ卵|養殖|養蜂/.test(p) || /ふ卵器/.test(stageName || '')) return 'farm';
  if (/中深層/.test(p)) return 'deep';
  if (/海底/.test(p)) return 'seafloor';
  if (/地下|氷床の下/.test(p)) return 'rock';
  if (/土|凍土|砂浜/.test(p) && !/砂浜/.test(p)) return 'soil';
  if (/南極/.test(p)) return 'ice';
  if (/池|湖|川|湿地|田んぼ|水たまり|五大湖/.test(p)) return 'fresh';
  if (/洋|海|沖|岩礁|サンゴ|岩場|沿岸|砂浜/.test(p)) return 'ocean';
  if (/砂漠|砂/.test(p)) return 'desert';
  if (/都市|町|軒下|納屋|橋/.test(p)) return 'city';
  if (/熱帯/.test(p)) return 'jungle';
  if (/森|林|タイガ|シベリア|カナダ/.test(p)) return 'forest';
  if (/サバンナ|草原|ステップ|プレーリー|パンパ|牧草|畑|農地|セレンゲティ|マラ/.test(p)) return 'grass';
  if (/ツンドラ|北極/.test(p)) return 'tundra';
  if (o.tags.includes('prok') || o.tags.includes('protist')) return 'ocean';
  return 'grass';
}
function spriteOf(o, stageName){
  const s = stageName || '';
  if (o.tags.includes('prok')) return 'cell';
  if (o.tags.includes('protist')) return 'protist';
  if (/卵|卵包|コクーン|卵のう/.test(s)) return 'egg';
  if (/種子/.test(s)) return 'seed';
  if (/芽生え/.test(s)) return 'sprout';
  if (/おたまじゃくし/.test(s)) return 'tadpole';
  if (/仔魚|プラヌラ/.test(s)) return 'tiny';
  if (o.id === 'human') return 'human';
  const n = o.name, g = o.group || '';
  if (/樹木|木|針葉/.test(n) && o.tags.includes('plant')) return /針葉/.test(n) ? 'conifer' : 'tree';
  if (/草/.test(n) && o.tags.includes('plant')) return /イネ/.test(n) ? 'grass' : 'herb';
  if (/クジラ|イルカ|シャチ|ジュゴン|マナティ/.test(n) || /cetacean/.test(o.tpl || '')) return 'whale';
  if (/サメ|エイ/.test(n) || /サメ/.test(g)) return 'shark';
  if (/魚|チョウザメ|肺魚|ヤツメ|シーラカンス/.test(g)) return 'fish';
  if (/ペンギン/.test(n)) return 'penguin';
  if (/ニワトリ|アヒル|シチメンチョウ/.test(n)) return 'chick';
  if (/鳥|家禽/.test(g)) return 'bird';
  if (/コウモリ/.test(n)) return 'bat';
  if (/ゴリラ|チンパンジー|サル|オランウータン|テナガザル|ヒヒ|マーモセット|キツネザル/.test(n) || o.tpl === 'primate') return 'primate';
  if (/ネズミ|モグラ|リス|ハムスター|トガリ|ウサギ|ヤマネ/.test(n) || ['rodentT','insectiv','lago'].includes(o.tpl)) return 'mouse';
  if (/哺乳|家畜/.test(g)) return 'quad';
  if (/カメ/.test(n)) return 'turtle';
  if (/ヘビ|ボア|ニシキヘビ|マムシ|コブラ|タイパン/.test(n) || o.tpl === 'snakeT') return 'snake';
  if (/爬虫/.test(g)) return 'lizard';
  if (/両生/.test(g)) return /サンショウウオ|イモリ/.test(n) ? 'lizard' : 'frog';
  if (/タコ/.test(n)) return 'octo';
  if (/イカ/.test(n)) return 'squid';
  if (/クラゲ/.test(n)) return 'jelly';
  if (/クモ|ダニ/.test(n)) return 'spider';
  if (/甲殻|オキアミ|カイアシ/.test(g + n)) return 'crust';
  if (/線虫|ミミズ|ワムシ|クマムシ/.test(n)) return 'worm';
  if (/昆虫|六脚/.test(g)) return 'insect';
  if (/軟体/.test(g)) return 'octo';
  return 'insect';
}
function hash(i){ let x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function drawBg(c, kind, f){
  const B = BGS[kind] || BGS.grass;
  const grad = (top, bot, y0, y1) => { for (let y = y0; y < y1; y++){ const t = (y - y0) / Math.max(1, y1 - y0 - 1); c.fillStyle = mix(top, bot, Math.round(t * 4) / 4); c.fillRect(0, y, PW, 1); } };
  if (B.indoor){
    c.fillStyle = B.wall; c.fillRect(0, 0, PW, 56); c.fillStyle = B.floor; c.fillRect(0, 56, PW, 24);
    c.fillStyle = '#a8906a'; for (let x = 0; x < PW; x += 24) c.fillRect(x, 0, 2, 56);
    c.fillStyle = '#f4e8a0'; for (let x = 20; x < PW; x += 48){ c.fillRect(x, 4, 8, 3); }
    c.fillStyle = '#8a7458'; for (let i = 0; i < 40; i++) c.fillRect(Math.floor(hash(i) * PW), 58 + Math.floor(hash(i + 9) * 20), 1, 1);
    return;
  }
  if (B.sky){
    const gy = B.water ? 50 : 56;
    grad(B.sky, mix(B.sky, '#ffffff', 0.4), 0, gy);
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 3; k++){ const x = ((hash(k) * PW + f * (0.15 + k * 0.05)) % (PW + 40)) - 20, y = 6 + k * 7; c.fillRect(x, y, 14, 3); c.fillRect(x + 3, y - 2, 8, 2); }
    if (B.water){ c.fillStyle = B.water; c.fillRect(0, gy, PW, PH - gy); c.fillStyle = B.ground || '#4a5a3a'; if (B.bottom){ c.fillStyle = B.bottom; c.fillRect(0, PH - 6, PW, 6); } else { c.fillRect(0, gy - 4, PW * 0.55, 6); } }
    else { c.fillStyle = B.ground; c.fillRect(0, gy, PW, PH - gy); }
    if (kind === 'ice'){ c.fillStyle = B.water; c.fillRect(PW * 0.6, 54, PW * 0.4, PH - 54); c.fillStyle = B.ground; c.fillRect(0, 54, PW * 0.6, PH - 54); }
    if (B.reeds){ c.fillStyle = '#3a6a2a'; for (let i = 0; i < 14; i++){ const x = Math.floor(hash(i) * PW); c.fillRect(x, 30 + (i % 3) * 3, 1, 22); c.fillStyle = '#6a4a2a'; c.fillRect(x, 28 + (i % 3) * 3, 1, 3); c.fillStyle = '#3a6a2a'; } }
    if (B.canopy){ c.fillStyle = B.trees; for (let i = 0; i < (B.dense ? 14 : 9); i++){ const x = Math.floor(hash(i + 3) * PW), w = 14 + Math.floor(hash(i + 7) * 14); c.fillRect(x + w / 2 - 1, 30, 3, gy - 30); c.fillRect(x, 16 + Math.floor(hash(i) * 10), w, 16); } }
    if (B.acacia){ c.fillStyle = '#5a6a2a'; [30, 120, 170].forEach((x, i) => { c.fillRect(x, 38, 2, 18); c.fillRect(x - 10, 34 - i, 22, 4); }); c.fillStyle = '#b09848'; for (let i = 0; i < 60; i++) c.fillRect(Math.floor(hash(i) * PW), 56 + Math.floor(hash(i + 1) * 22), 1, 2); }
    if (B.dunes){ c.fillStyle = '#d0b070'; for (let x = 0; x < PW; x++){ const h = 4 + Math.round(3 * Math.sin(x / 18)); c.fillRect(x, 56 - h, 1, h); } }
    if (B.buildings){ c.fillStyle = '#7a8898'; for (let i = 0; i < 8; i++){ const x = i * 26, h = 18 + Math.floor(hash(i) * 26); c.fillRect(x, 56 - h, 20, h); c.fillStyle = '#e8e0a0'; for (let wy = 56 - h + 3; wy < 52; wy += 5) c.fillRect(x + 4, wy, 2, 2), c.fillRect(x + 12, wy, 2, 2); c.fillStyle = '#7a8898'; } }
    if (B.roots){ c.fillStyle = '#5a9a3a'; c.fillRect(0, 54, PW, 3); c.fillStyle = B.top; c.fillRect(0, 57, PW, PH - 57); }
    return;
  }
  grad(B.top, B.bot, 0, PH);
  if (B.strata){ for (let i = 0; i < 6; i++){ c.fillStyle = i % 2 ? '#2e2823' : '#433a32'; for (let x = 0; x < PW; x++){ const y = 8 + i * 13 + Math.round(2 * Math.sin(x / 15 + i)); c.fillRect(x, y, 1, 2); } } c.fillStyle = '#5a4f44'; for (let i = 0; i < 30; i++) c.fillRect(Math.floor(hash(i) * PW), Math.floor(hash(i + 4) * PH), 2, 1); }
  if (B.layers){ B.layers.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, 20 + i * 15, PW, 15); }); c.fillStyle = '#0e2238'; c.fillRect(0, 0, PW, 20); }
  if (B.roots){ c.fillStyle = '#8a6a48'; for (let i = 0; i < 5; i++){ let x = 20 + i * 38; for (let y = 0; y < 50; y++){ x += Math.round(hash(i * 100 + y) * 2 - 1); c.fillRect(x, y, 1, 1); } } }
  if (B.grassTop){ c.fillStyle = '#9cc8e8'; c.fillRect(0, 0, PW, 6); c.fillStyle = '#5a9a3a'; c.fillRect(0, 6, PW, 3); for (let x = 0; x < PW; x += 3) c.fillRect(x, 4 + (x % 2), 1, 2); }
  if (B.pebbles){ c.fillStyle = '#8a7a6a'; for (let i = 0; i < 25; i++) c.fillRect(Math.floor(hash(i + 50) * PW), Math.floor(hash(i + 60) * PH), 3, 2); }
  if (B.folds){ c.fillStyle = '#c87a86'; for (let i = 0; i < 6; i++){ for (let x = 0; x < PW; x++){ const y = 6 + i * 14 + Math.round(3 * Math.sin(x / 9 + i * 2)); c.fillRect(x, y, 1, 2); } } }
  if (B.pores){ c.fillStyle = '#a8705a'; for (let i = 0; i < 18; i++) c.fillRect(Math.floor(hash(i) * PW), Math.floor(hash(i + 2) * PH), 3, 3); }
  if (B.stal){ c.fillStyle = '#3a332c'; for (let i = 0; i < 16; i++){ const x = Math.floor(hash(i) * PW), h = 4 + Math.floor(hash(i + 1) * 12); for (let y = 0; y < h; y++) c.fillRect(x + Math.floor(y / 4), y, Math.max(1, 4 - Math.floor(y / 3)), 1); } }
  if (B.snow){ c.fillStyle = '#9fb0c8'; for (let i = 0; i < 40; i++){ const x = Math.floor(hash(i) * PW), y = Math.floor((hash(i + 1) * PH + f * 0.2 * (0.5 + hash(i + 2))) % PH); c.fillRect(x, y, 1, 1); } }
  if (B.glow){ c.fillStyle = '#5ae0d0'; for (let i = 0; i < 5; i++){ if ((f + i * 13) % 40 < 20) c.fillRect(Math.floor(hash(i + 70) * PW), Math.floor(hash(i + 80) * PH), 1, 1); } }
  if (B.bubbles){ c.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 8; i++){ const x = Math.floor(hash(i + 30) * PW), y = PH - ((f * 0.5 + hash(i + 40) * PH) % PH); c.fillRect(x, y, 1, 1); } c.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 4; i++) c.fillRect(20 + i * 50, 0, 6, PH); }
}
function mix(a, b, t){
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t), g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t), bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}
function drawSprite(c, key, x, y, scale, flip, alpha){
  const rows = SPR[key], col = SPC[key] || ['#888', '#ccc'];
  const pal = { k:'#1a1a1a', b:col[0], l:col[1], w:'#f6f4ee', e:'#000', y:'#e8b030', r:'#d83a3a', g:col[0] === '#8a8a5a' ? '#6a7a3a' : (key === 'tree' || key === 'conifer' || key === 'grass' || key === 'herb' || key === 'sprout' ? col[0] : '#5a9a3a'), n:'#7a5a3a', '~':'#1a1a1a' };
  if (key === 'tree' || key === 'conifer'){ pal.l = col[1]; }
  c.globalAlpha = alpha == null ? 1 : alpha;
  const w = Math.max(...rows.map(r => r.length));
  rows.forEach((row, j) => { for (let i = 0; i < row.length; i++){ const ch = row[i]; if (ch === ' ' || !pal[ch]) continue; c.fillStyle = pal[ch]; const xi = flip ? (w - 1 - i) : i; c.fillRect(Math.round(x + xi * scale), Math.round(y + j * scale), scale, scale); } });
  c.globalAlpha = 1;
}
function spriteSize(key){ const r = SPR[key]; return { w: Math.max(...r.map(x => x.length)), h: r.length }; }
// 場面を描く
function renderScene(canvas, opt){
  const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false;
  const f = opt.frame || 0;
  drawBg(c, opt.scene, f);
  const key = opt.sprite, sz = spriteSize(key);
  const big = ['tree','conifer','whale','shark'].includes(key);
  const scale = big ? 4 : (sz.w <= 6 ? 6 : sz.w <= 10 ? 5 : 4);
  const ground = ['grass','forest','jungle','desert','city','tundra','ice','farm','soil'].includes(opt.scene) && !['bird','bat','insect','cell','protist','tiny'].includes(key) ? (opt.scene === 'soil' ? 76 : opt.scene === 'farm' ? 74 : 60) : null;
  const bob = opt.dead ? 0 : Math.round(Math.sin(f / 6) * (ground ? 0 : 2));
  const mx = PW / 2 - sz.w * scale / 2 + (opt.dead ? 0 : Math.round(Math.sin(f / 23) * 6));
  const my = ground ? ground - sz.h * scale : PH / 2 - sz.h * scale / 2 + bob;
  // きょうだい
  const sib = Math.min(opt.sibs || 0, 9);
  for (let i = 0; i < sib; i++){
    const s2 = Math.max(2, scale - 3);
    const sx = Math.floor(hash(i + 200) * (PW - sz.w * s2)), sy = ground ? ground - sz.h * s2 : Math.floor(8 + hash(i + 300) * (PH - 16 - sz.h * s2)) + Math.round(Math.sin((f + i * 9) / 7) * 1.5);
    if (Math.abs(sx + sz.w * s2 / 2 - PW / 2) < 22 && Math.abs(sy - my) < 18) continue;
    drawSprite(c, key, sx, sy, s2, hash(i) > 0.5, 0.85);
  }
  if (opt.divided){ drawSprite(c, key, mx - 18, my - 4, scale, false, 1); drawSprite(c, key, mx + 18, my + 4, scale, true, 1); }
  else drawSprite(c, key, mx, my, scale, (f / 40 | 0) % 2 === 1 && !big, opt.dead ? 0.25 : 1);
  if (opt.dead && !opt.divided){ c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, 0, PW, PH); }
}
const SCENE_JA = { ocean:'海の表層', deep:'中深層の暗闇', seafloor:'海底の泥の中', rock:'地下の岩の中', soil:'土の中', gut:'体の中', face:'ヒトの顔の毛穴', forest:'森', jungle:'熱帯の森', grass:'草原', desert:'乾いた土地', fresh:'水辺', ice:'氷の世界', farm:'建物の中', city:'ヒトの町', cave:'洞窟', tundra:'寒い草原' };
