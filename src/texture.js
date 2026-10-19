// ===== この一生の手ざわり（16タイプ） =====
const AXES = [
  ['瞬','永','時間','同じ瞬間に生まれた仲間の半分より早く終わったか、長く生きたか'],
  ['孤','群','まわり','ひとり（少ないきょうだい）で生まれたか、大勢の中に生まれたか'],
  ['凪','波','過ごし方','用心深く静かに過ごしたか、食べて動いて危険に近づいたか'],
  ['還','継','残したもの','子を残さず自然に還ったか、次の命につないだか'],
];
const TEX = {
  '瞬群凪還':['潮に溶けたひと粒','大勢のきょうだいの中で静かに始まり、すぐに海や土へ還った一生。地球の命の多くは、この手ざわりで終わります。'],
  '瞬群凪継':['静かに受け渡した者','目立たず、短く、それでも次の命へ確かに受け渡した一生。'],
  '瞬群波還':['先を急いだ群れの一匹','群れの中で誰よりも早く動き、そのぶん早く終わった一生。'],
  '瞬群波継':['駆け抜けて灯をつないだ者','短い時間を全力で使い、次の世代に火を渡した一生。'],
  '瞬孤凪還':['ひとりきりの短い夢','少ない仲間とともに生まれ、静かなまま終わった一生。'],
  '瞬孤凪継':['小さく確かな橋','短くても、ひとつの命から次の命へ橋をかけた一生。'],
  '瞬孤波還':['流れ星のような一生','ひとりで飛び出し、明るく、すぐに消えていった一生。'],
  '瞬孤波継':['火花を残した者','短く激しく生き、火花のように子を残した一生。'],
  '永群凪還':['群れを見送った古老','大勢の仲間が去っていくのを見送りながら、静かに長く生きた一生。'],
  '永群凪継':['根を張った大樹','大勢の中で生きのび、どっしりと構えて次の命を育てた一生。'],
  '永群波還':['群れの先頭を泳ぎ続けた者','仲間の誰よりも長く、休まず動き続けた一生。'],
  '永群波継':['季節をめぐる旅人','動き、食べ、何度も季節をめぐって命をつないだ一生。'],
  '永孤凪還':['深い場所の隠者','ひとり静かに、誰も知らない場所で長い時間を過ごした一生。'],
  '永孤凪継':['ゆっくり灯す者','急がず、ひとつずつ、長い時間をかけて命を灯した一生。'],
  '永孤波還':['ひとりで歩いた遠い道','ひとりで遠くまで動き続け、自然に還った一生。'],
  '永孤波継':['道を拓いた者','ひとりで動き、危険を越え、次の命への道を拓いた一生。'],
};
function speciesActive(o){ return !(o.tags.includes('prok') || o.tags.includes('protist') || o.tags.includes('plant') || /貝|クラゲ|ワムシ|クマムシ/.test(o.name)); }
function speciesGroup(o){ return (o.clutch || 1) > 10 || o.r0 === 'social' || o.tags.includes('prok') || o.tags.includes('protist'); }
function textureOf(o, life, opts){
  const long = opts.divided ? true : surv(o, life) < 0.5;
  const group = speciesGroup(o);
  let active;
  if (opts.act > opts.calm) active = true; else if (opts.calm > opts.act) active = false; else active = speciesActive(o);
  const leave = opts.divided || opts.kids > 0;
  const key = (long ? '永' : '瞬') + (group ? '群' : '孤') + (active ? '波' : '凪') + (leave ? '継' : '還');
  return { key, name: TEX[key][0], desc: TEX[key][1], bits: [long, group, active, leave] };
}
// いまの設定で、その手ざわりになる命の割合
function textureShare(ws, key, n = 20000){
  let hit = 0;
  for (let i = 0; i < n; i++){
    const o = draw(ws), t = quickLife(o);
    const lastNonFinal = o.stages.findIndex(s => s.final);
    const divided = o.r0 === 'divide' && t >= o.stages[0].d * 0.85;
    const reachedAdult = lastNonFinal >= 0 && surv(o, t) <= o.pAdult * 0.999 + 1e-12 ? true : false;
    const leave = divided || (o.r0 !== 'managed' && o.r0 !== 'social' && lastNonFinal >= 0 && t > stageStart(o, lastNonFinal) + Math.min(o.stages[lastNonFinal].d * 0.3, Y));
    const long = divided || surv(o, t) < 0.5;
    const k = (long ? '永' : '瞬') + (speciesGroup(o) ? '群' : '孤') + (speciesActive(o) ? '波' : '凪') + (leave ? '継' : '還');
    if (k === key) hit++;
  }
  return hit / n;
}
function stageStart(o, idx){ let t = 0; for (let i = 0; i < idx; i++) t += o.stages[i].d; return t; }
