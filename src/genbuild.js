// ===== 1000種の自動生成（AnAge + Wikidata） =====
const T = (early, juv, adult, lines, place) => ({ early, juv, adult, lines, place });
const OCEANP = [['太平洋',45],['大西洋',30],['インド洋',20],['南極海',5]];
const TPL = {
  raptor: T({'卵を狙うカラス・テン':5,'孵化できなかった':3,'寒さ・雨':2},{'きょうだいとの争い':3,'飢餓（狩りがうまくできない）':5,'事故':2},{'電線・風力発電機との衝突':3,'飢餓':3,'毒餌・鉛中毒':2,'ほかの猛禽との争い':2},
    { egg:['高い木の上の大きな巣で生まれた'], juv:['先に生まれたきょうだいのほうが大きい','初めて獲物を捕まえた。何十回目の挑戦で'], adult:['上昇気流に乗って、ほとんど羽ばたかずに空を回った','あなたの目は、ヒトの数倍の解像度で地面を見ている'] }, PL.land),
  owl: T({'テン・カラスに襲われた':5,'孵化できなかった':3,'寒さ':2},{'飢餓':5,'交通事故':3,'他の猛禽':2},{'交通事故':4,'冬の飢餓':3,'殺鼠剤の二次中毒':2,'その他':1},
    { egg:['木のうろの中で生まれた'], juv:['まだ飛べないのに巣から出て、枝を歩いた（巣立ち前の「枝移り」）'], adult:['音だけでネズミの位置を正確に知る。左右の耳の高さがずれているから','羽のふちのギザギザが、羽音を消してくれる'] }, PL.land),
  seabird: T({'カモメ・ネズミに卵を食べられた':5,'孵化できなかった':3,'嵐':2},{'飢餓（親が餌をとれなかった）':5,'トウゾクカモメなどに襲われた':3,'嵐':2},{'延縄漁の釣り針にかかった':4,'プラスチックの誤飲':2,'嵐・飢餓':3,'外来のネズミ・ネコ':1},
    { egg:['海に囲まれた島の繁殖地で生まれた','卵は1個だけ。両親が交代で温める'], juv:['親が何百kmも飛んで、餌を運んでくる','初めて海に出た。次に陸に戻るのは何年も先'], adult:['何年もかけて、同じ相手と同じ島に戻ってくる','あなたの鼻は塩を出す腺につながっている。海水を飲んでも平気'] }, OCEANP),
  penguin: T({'トウゾクカモメに盗まれた':6,'雪どけ水で冷えた':4},{'飢餓':5,'トウゾクカモメ・オオフルマカモメ':3,'寒さ':2},{'ヒョウアザラシ・シャチに食べられた':5,'海氷の変化による飢餓':4,'その他':1},
    { egg:['氷の上、親の足の上で温められた'], juv:['ひなの「保育園」で、仲間と身を寄せ合った'], adult:['水中を飛ぶように泳いだ','数百mの深さまで潜った'] }, [['南極',70],['南米南部',20],['南アフリカ・オーストラリア',10]]),
  shore: T({'キツネ・カラスに卵を食べられた':5,'高潮で巣が流された':3,'踏まれた':2},{'ハヤブサ・カモメに食べられた':5,'飢餓':3,'寒さ':2},{'渡りの途中で力尽きた':4,'干潟の減少':3,'ハヤブサに食べられた':3},
    { egg:['地面のくぼみの巣で生まれた。卵は石ころそっくり'], juv:['生まれてすぐ自分で歩き、餌をついばんだ','親が「けがのふり」をして、キツネを遠ざけた（擬傷）'], adult:['北極圏から南半球まで、毎年1万km以上を渡る','干潟でゴカイを探した'] }, [['東アジアの干潟',30],['北極圏のツンドラ',30],['ヨーロッパの海岸',20],['南北アメリカの海岸',20]]),
  water: T({'キツネ・カラス・アライグマに卵を食べられた':6,'洪水':2,'孵化できなかった':2},{'ワシ・キツネ・大きな魚に食べられた':6,'寒さ':2,'飢餓':2},{'狩猟':4,'鳥インフルエンザなどの病気':2,'キツネ・ワシ':2,'鉛中毒':2},
    { egg:['水辺の草むらの巣で、羽毛にくるまれて生まれた'], juv:['孵化した翌日には泳いでいた','母親のあとを一列になってついていく'], adult:['秋、何千kmも渡った','羽が一度に抜けかわって、しばらく飛べなくなった（換羽）'] }, [['シベリア〜東アジア',30],['北米',30],['ヨーロッパ',25],['その他',15]]),
  parrot: T({'ヘビ・サルに卵を食べられた':5,'密猟（ひなの捕獲）':3,'孵化できなかった':2},{'猛禽に食べられた':4,'飢餓':3,'ペット取引のための捕獲':3},{'森林伐採で巣穴を失った':4,'ペット取引のための捕獲':3,'猛禽':2,'病気':1},
    { egg:['木のうろの中で生まれた'], juv:['群れの仲間の声をまねして、自分の名前のような鳴き声を覚えた'], adult:['足で木の実をつかみ、くちばしで割った','毎日、同じ粘土の崖に来て土を食べる（毒消しのため）'] }, [['南米の熱帯林',40],['オーストラリア',25],['東南アジア',15],['アフリカ',15],['その他',5]]),
  galli: T({'キツネ・ヘビ・カラスに卵を食べられた':7,'孵化できなかった':3},{'キツネ・タカに食べられた':6,'寒さ・雨':3,'飢餓':1},{'狩猟':4,'キツネ・タカ':4,'冬の寒さ':2},
    { egg:['地面の巣で、10個以上のきょうだいと生まれた'], juv:['孵化したその日に歩いて、自分で虫をついばんだ'], adult:['砂浴びをした','（オスなら）春、羽を広げて求愛のディスプレイをした'] }, PL.land),
  pigeon: T({'カラス・ヘビに食べられた':6,'巣が雑で卵が落ちた':4},{'タカ・ネコに食べられた':6,'飢餓':4},{'タカ・ハヤブサ':5,'病気':3,'その他':2},
    { egg:['枝を数本置いただけの簡単な巣で生まれた'], juv:['親がのどから出す「ピジョンミルク」で育った'], adult:['太陽と地磁気を使って、何百km先からでも巣に帰れる'] }, PL.land),
  wader: T({'カラス・アライグマに卵を食べられた':5,'嵐':3,'孵化できなかった':2},{'飢餓':5,'ワニ・猛禽':3,'事故':2},{'湿地の消失':4,'電線との衝突':3,'冬の寒さ':3},
    { egg:['水辺の木の上の集団繁殖地で生まれた'], juv:['大きな口で、親ののどから魚を受け取った'], adult:['浅瀬でじっと動かず、魚が来るのを待った','長い脚で湿地を歩いた'] }, [['アジアの湿地',35],['アフリカの湿地',25],['南北アメリカの湿地',30],['ヨーロッパの湿地',10]]),
  swift: T({'ヘビ・カラスに食べられた':5,'寒さ':3,'孵化できなかった':2},{'飢餓（悪天候で虫がいない）':6,'猛禽':4},{'悪天候による飢餓':5,'猛禽':3,'窓・建物との衝突':2},
    { egg:['小さな巣で、小さな卵として生まれた'], juv:['巣立った瞬間から、ほとんど地上に降りない'], adult:['羽ばたく回数は1秒に数十回','夜は体温を下げて、エネルギーを節約した'] }, PL.land),
  ratite: T({'ジャッカル・ハイエナに卵を割られた':6,'孵化できなかった':4},{'ライオン・ハイエナ・猛禽':7,'飢餓':3},{'捕食':4,'狩猟':3,'干ばつ':3},
    { egg:['大きな卵として、砂の巣で生まれた'], juv:['生まれてすぐ、群れで走った'], adult:['飛べない。そのかわり、時速数十kmで走る'] }, [['アフリカ',50],['オーストラリア',30],['南米',20]]),
  passer: T({'ヘビ・カラス・リスに食べられた':6,'孵化できなかった':2,'托卵された':2},{'ネコ・タカ・カラスに食べられた':5,'冬の飢餓・寒さ':3,'窓ガラスへの衝突':1,'病気':1},{'ネコ・タカに食べられた':4,'冬の飢餓・寒さ':3,'窓ガラス・車への衝突':2,'病気':1},
    { egg:['草や小枝でつくられたお椀形の巣で生まれた'], juv:['親が1日に数百回、虫を運んでくる','初めて飛んだ','父親の歌を聞いて、さえずりを覚えはじめた'], adult:['春、さえずって縄張りを主張した','つがいになって巣をつくった'] }, PL.land),
  bird: T({'卵を食べられた':6,'孵化できなかった':4},{'捕食':5,'飢餓':3,'病気':2},{'捕食':4,'生息地の消失':3,'冬の飢餓':3},
    { egg:['巣の中の卵として生まれた'], juv:['初めて飛んだ'], adult:['つがいになった'] }, PL.land),

  primate: T({'母親が死んだ':3,'病気':4,'ヒョウ・猛禽に襲われた':2,'子殺し':1},{'病気':4,'ヒョウ・ワシに襲われた':3,'群れからはぐれた':2,'わな':1},{'森林伐採':3,'狩猟・密猟':3,'病気':3,'群れどうしの争い':1},
    { early:['母親のお腹にしがみついて移動する','群れの仲間が、かわるがわるのぞきこんでくる'], juv:['木登りの練習をした。何度も落ちた','群れの仲間と毛づくろいをし合った'], adult:['群れの順位が上がった','ヒトとの共通祖先は、数百万〜数千万年前'] }, [['アフリカの熱帯林',40],['東南アジアの熱帯林',30],['南米の熱帯林',25],['日本の森',5]]),
  carniv: T({'母親が狩りに出ている間に襲われた':4,'飢餓':4,'病気':2},{'狩りがうまくできず飢えた':5,'より大きな肉食獣に殺された':3,'交通事故':2},{'ヒトとの衝突（家畜被害の報復・駆除）':3,'縄張り争いのけが':3,'交通事故':2,'飢餓':2},
    { early:['目が開くまで、巣穴できょうだいと眠っていた','母親が運んできた獲物で狩りを覚える'], juv:['初めてひとりで獲物を捕った','親の縄張りを離れた'], adult:['自分の縄張りを持った','においをつけて、縄張りの境界を知らせた'] }, PL.land),
  pinniped: T({'シャチ・ホッキョクグマに襲われた':3,'母親とはぐれて飢えた':5,'嵐で流された':2},{'シャチ・サメに食べられた':5,'飢餓':3,'漁網':2},{'シャチ・サメ':4,'漁網に絡まった':3,'飢餓':3},
    { early:['氷の上、または岩の浜で生まれた','母乳は脂肪分が50%近い。数週間で体重が何倍にもなる'], juv:['初めて海に入った'], adult:['何百mも潜って魚を捕った','繁殖期、何千頭もの仲間が同じ浜に集まった'] }, [['北太平洋',35],['北大西洋',25],['南極海',30],['その他',10]]),
  cetacean: T({'シャチに襲われた':5,'母親とはぐれた':3,'その他':2},{'漁網に絡まった':5,'シャチ・サメ':3,'病気':2},{'漁網に絡まった':4,'船との衝突':3,'病気':2,'座礁':1},
    { early:['尾びれから先に、水の中で生まれた','母親が水面まで押し上げて、最初の息をさせてくれた'], juv:['群れの仲間と、狩りのしかたを覚えた'], adult:['仲間と鳴き声で呼び合った','眠るときは脳の半分ずつ休ませる'] }, OCEANP),
  ungulate: T({'ハイエナ・オオカミ・ネコ科の肉食獣に食べられた':6,'寒さ・飢餓':2,'母親とはぐれた':2},{'肉食獣に食べられた':4,'冬の飢餓・干ばつ':3,'病気':2,'狩猟':1},{'狩猟・密猟':4,'肉食獣':2,'干ばつ・冬の飢餓':2,'交通事故':2},
    { early:['生まれて数十分で立ち上がった','草むらにじっと身を伏せて、母親を待った'], juv:['群れと一緒に、草を求めて移動した'], adult:['反すうした（ウシの仲間なら）','季節の移動で、何百kmも歩いた'] }, PL.land),
  rodentT: T({'ヘビ・イタチに襲われた':5,'寒さ':3,'母親が死んだ':2},{'フクロウ・キツネ・ヘビに食べられた':6,'飢餓':2,'病気':2},{'フクロウ・キツネ・ヘビ・ネコに食べられた':6,'寒さ・飢餓':2,'病気':1,'殺鼠剤・わな':1},
    { early:['目も開かないまま、きょうだいと身を寄せ合う'], juv:['巣立った。外は危険だらけ','ほお袋に種を詰めこんだ'], adult:['前歯は一生伸び続ける。かじって削る','冬に備えて、食べ物を貯めこんだ'] }, PL.land),
  batT: T({'母親とはぐれた':5,'病気':3,'捕食':2},{'冬眠中の脂肪切れ':4,'フクロウ・ネコ':3,'病気':2,'風力発電機':1},{'冬眠中の飢餓':3,'フクロウ・ヘビ':3,'病気':2,'風力発電機・事故':2},
    { early:['何千頭もの仲間と、洞窟の天井で育つ'], juv:['初めて飛んだ。超音波の反響で、暗闇の地図をつくる'], adult:['一晩に数百匹の虫を食べた','（果物を食べるコウモリなら）種を運んで森を広げる'] }, PL.land),
  insectiv: T({'捕食':5,'寒さ':3,'飢餓':2},{'フクロウ・イタチに食べられた':5,'飢餓':3,'寒さ':2},{'フクロウ・イタチ':5,'冬の飢餓':3,'交通事故':2},
    { early:['巣の中で、きょうだいとくっついて眠る'], juv:['初めて自分でミミズを捕まえた'], adult:['1日に体重と同じくらいの虫を食べる','鼻先で土の中の獲物を探した'] }, PL.land),
  lago: T({'キツネ・イタチに掘り出された':5,'寒さ・雨':3,'病気':2},{'キツネ・タカ・ヤマネコに食べられた':6,'病気':3,'飢餓':1},{'キツネ・タカ':5,'病気':3,'交通事故':2},
    { early:['生まれたときから毛が生えていた（ノウサギなら）'], juv:['自分のふんをもう一度食べて、栄養を取りなおした'], adult:['ジグザグに跳んで、キツネをまいた','冬毛は白くなる（寒い地方の種なら）'] }, PL.land),
  marsup: T({'袋から落ちた':4,'母親が死んだ':4,'病気':2},{'ディンゴ・キツネ・ワシに食べられた':5,'交通事故':2,'干ばつ':3},{'交通事故':3,'森林火災':3,'外来のキツネ・ネコ':2,'干ばつ':2},
    { early:['生まれたときは豆粒ほど。自力で母親の袋まで這い上がった','袋の中で、何か月も乳を飲んで育つ'], juv:['初めて袋から顔を出した'], adult:['夜、ユーカリの林を歩いた'] }, [['オーストラリア',85],['ニューギニア',10],['南米',5]]),
  xenar: T({'ジャガー・猛禽':5,'病気':3,'母親とはぐれた':2},{'ジャガー・ピューマ':5,'交通事故':3,'飢餓':2},{'交通事故':4,'森林伐採':3,'狩猟':3},
    { early:['母親の背中に乗って移動した'], juv:['長い舌でアリを集めた'], adult:['体温は哺乳類としては低い。省エネで生きている'] }, [['南米',85],['中米',15]]),
  mammal: T({'捕食':5,'病気':3,'飢餓':2},{'捕食':5,'飢餓':3,'病気':2},{'生息地の消失':4,'捕食':3,'病気':3},
    { early:['母親の乳で育った'], juv:['ひとりで生きていく練習をした'], adult:['子孫を残した'] }, PL.land),

  turtle: T({'アライグマ・キツネに巣を掘られた':6,'孵化できなかった':2,'洪水':2},{'鳥・魚・哺乳類に食べられた':7,'乾燥':2,'寒さ':1},{'交通事故':3,'ペット取引・食用の捕獲':3,'生息地の消失':3,'その他':1},
    { early:['土の中の卵として生まれた。温度で性別が決まる'], juv:['甲羅はまだ柔らかい'], adult:['冬眠した','あなたの寿命は、ヒトより長いかもしれない'] }, PL.fresh),
  croc: T({'オオトカゲに巣を掘られた':6,'洪水':4},{'サギ・魚・大きなワニに食べられた':8,'その他':2},{'ヒトに殺された':4,'縄張り争い':3,'干ばつ':3},
    { early:['卵の中から鳴いた。母親が掘り出してくれた'], juv:['母親の口に入れて運ばれた'], adult:['水面に目と鼻だけ出して、獲物を待った'] }, [['アフリカの川',35],['南アジアの川',25],['オーストラリア北部',15],['南北アメリカの湿地',25]]),
  snakeT: T({'哺乳類に卵を食べられた':6,'カビ':4},{'鳥・哺乳類に食べられた':6,'飢餓':2,'寒さ':2},{'タカ・ワシに食べられた':4,'ヒトに殺された':3,'交通事故':2,'寒さ':1},
    { early:['生まれてすぐ、ひとりで生きていく'], juv:['脱皮した。目まで白く濁る数日間'], adult:['舌で空気中のにおいを集めて、獲物の通り道を見つけた','自分の頭より大きな獲物を丸のみにした'] }, PL.land),
  lizardT: T({'ヘビ・哺乳類に卵を食べられた':5,'カビ・乾燥':5},{'鳥・ヘビに食べられた':6,'ネコに食べられた':2,'寒さ・飢餓':2},{'鳥・ヘビに食べられた':5,'ネコ':2,'寒さ・飢餓':2,'病気':1},
    { early:['土の中の卵として生まれた'], juv:['危なかった。尾を切って逃げた'], adult:['朝、石の上で日光浴をして体を温めた'] }, PL.land),
  frogT: T({'食べられた':5,'池が干上がった':3,'カビ':2},{'ヤゴ・魚・鳥に食べられた':7,'池が干上がった':3},{'ヘビ・鳥に食べられた':5,'ツボカビ症':2,'交通事故':2,'冬眠中の死':1},
    { early:['ゼリーに包まれた卵として生まれた'], juv:['後ろ足が生えてきた','尾が消え、陸に上がった'], adult:['雨の夜、池で鳴いた'] }, PL.fresh),
  salT: T({'食べられた':6,'カビ':4},{'魚・ヤゴに食べられた':6,'水が干上がった':4},{'ヘビ・鳥に食べられた':5,'乾燥':2,'ツボカビ症などの病気':2,'交通事故':1},
    { early:['水草に産みつけられた卵として生まれた'], juv:['外えらで呼吸している'], adult:['雨の夜、落ち葉の上で虫を捕った','切れた足が、また生えてきた'] }, PL.fresh),

  shark: T({'大型のサメに食べられた':6,'漁で混獲された':4},{'延縄・刺し網で獲られた':6,'大型のサメ・シャチ':4},{'漁で獲られた（ヒレ目的を含む）':7,'その他':3},
    { early:['母親のお腹から、子どもの姿で生まれた（または卵のケースから孵った）'], juv:['電気を感じる器官で、砂の中の獲物を見つけた'], adult:['あなたの体には骨がない。全身が軟骨でできている','歯は一生、何千本も生えかわる'] }, OCEANP),
  fishT: T({'動物プランクトン・魚に食べられた':8,'孵化できなかった':2},{'大きな魚に食べられた':6,'飢餓（最初の餌に出会えなかった）':4},{'漁で獲られた':4,'大型魚・鳥・哺乳類に食べられた':4,'病気・寄生虫':2},
    { early:['水中に漂う、小さな卵として生まれた'], juv:['卵黄を使いきった。数日以内に餌を見つけなければならない','群れに加わった'], adult:['産卵場へ向かって泳いだ'] }, PL.ocean),
  salmonid: T({'泥で窒息した':5,'食べられた':5},{'鳥・大きな魚に食べられた':7,'増水':3},{'漁・釣りで獲られた':4,'クマ・鳥に食べられた':3,'ダムで川をさかのぼれなかった':3},
    { early:['川底の砂利の中で生まれた'], juv:['川の流れに向かって、じっと泳ぎ続けた'], adult:['生まれた川のにおいを覚えている'] }, [['北太平洋の川',50],['北大西洋の川',30],['湖',20]]),
  freshfish: T({'食べられた':7,'カビ':3},{'大きな魚・鳥に食べられた':7,'酸欠':3},{'漁・釣り':4,'サギ・カワウ':3,'水質悪化':3},
    { early:['水草に産みつけられた卵として生まれた'], juv:['岸辺の浅瀬で、稚魚の群れと過ごした'], adult:['川底の石の陰で休んだ'] }, PL.fresh),
};
function tplOf(g){
  const o = g.order, fam = g.fam;
  if (g.cls === 'Aves'){
    if (o === 'Strigiformes') return 'owl';
    if (['Accipitriformes','Falconiformes','Cathartiformes'].includes(o)) return 'raptor';
    if (o === 'Sphenisciformes') return 'penguin';
    if (['Procellariiformes','Suliformes','Phaethontiformes','Gaviiformes'].includes(o) || ['Laridae','Alcidae','Stercorariidae'].includes(fam)) return 'seabird';
    if (o === 'Charadriiformes') return 'shore';
    if (['Anseriformes','Podicipediformes'].includes(o)) return 'water';
    if (o === 'Psittaciformes') return 'parrot';
    if (['Galliformes','Tinamiformes'].includes(o)) return 'galli';
    if (o === 'Columbiformes') return 'pigeon';
    if (['Pelecaniformes','Ciconiiformes','Gruiformes','Phoenicopteriformes','Eurypygiformes'].includes(o)) return 'wader';
    if (['Apodiformes','Caprimulgiformes'].includes(o)) return 'swift';
    if (['Struthioniformes','Casuariiformes','Rheiformes','Apterygiformes'].includes(o)) return 'ratite';
    if (o === 'Passeriformes') return 'passer';
    return 'bird';
  }
  if (g.cls === 'Mammalia'){
    if (o === 'Primates') return 'primate';
    if (['Phocidae','Otariidae','Odobenidae'].includes(fam)) return 'pinniped';
    if (o === 'Carnivora') return 'carniv';
    if (['Cetacea','Sirenia'].includes(o)) return 'cetacean';
    if (['Artiodactyla','Perissodactyla','Proboscidea','Hyracoidea','Tubulidentata'].includes(o)) return 'ungulate';
    if (o === 'Rodentia') return 'rodentT';
    if (o === 'Chiroptera') return 'batT';
    if (['Soricomorpha','Erinaceomorpha','Afrosoricida','Eulipotyphla','Macroscelidea','Scandentia','Monotremata'].includes(o)) return 'insectiv';
    if (o === 'Lagomorpha') return 'lago';
    if (['Diprotodontia','Dasyuromorphia','Peramelemorphia','Didelphimorphia','Microbiotheria'].includes(o)) return 'marsup';
    if (['Pilosa','Cingulata'].includes(o)) return 'xenar';
    return 'mammal';
  }
  if (g.cls === 'Reptilia'){
    if (o === 'Testudines') return 'turtle';
    if (o === 'Crocodilia') return 'croc';
    if (['Colubridae','Viperidae','Elapidae','Boidae','Pythonidae','Natricidae','Lamprophiidae','Dipsadidae','Typhlopidae','Hydrophiidae','Acrochordidae','Homalopsidae'].includes(fam)) return 'snakeT';
    return 'lizardT';
  }
  if (g.cls === 'Amphibia') return o === 'Anura' ? 'frogT' : 'salT';
  if (g.cls === 'Chondrichthyes') return 'shark';
  if (o === 'Salmoniformes' || o === 'Esociformes') return 'salmonid';
  if (['Cypriniformes','Siluriformes','Characiformes','Cyprinodontiformes','Percopsiformes','Gymnotiformes','Osteoglossiformes'].includes(o)) return 'freshfish';
  return 'fishT';
}
const IUCNJ = { LC:'低懸念（LC）', NT:'準絶滅危惧（NT）', VU:'絶滅危惧II類（VU）', EN:'絶滅危惧IB類（EN）', CR:'絶滅危惧IA類（CR）', DD:'情報不足（DD）' };
const IUCNM = { LC:1, NT:0.3, VU:0.1, EN:0.03, CR:0.005, DD:0.5, '?':0.7, '':0.7 };
const CLSJ = { Aves:'鳥類', Mammalia:'哺乳類', Reptilia:'爬虫類', Amphibia:'両生類', Teleostei:'魚類', Chondrichthyes:'魚類（サメ・エイ）', Chondrostei:'魚類（チョウザメ）', Holostei:'魚類', Dipnoi:'魚類（肺魚）', Cephalaspidomorphi:'無顎類（ヤツメウナギ）', Coelacanthi:'魚類（シーラカンス）' };
function massText(g){ const M = g.M; return M >= 1e6 ? (M / 1e6).toPrecision(2) + 't' : M >= 1000 ? (+(M / 1000).toPrecision(2)) + 'kg' : (+M.toPrecision(2)) + 'g'; }
const r1 = x => Math.round(x * 10) / 10;

function buildGen(){
  const gens = GEN.map(a => { const g = {}; GEN_KEYS.forEach((k, i) => g[k] = a[i]); return g; });
  const isFish = c => !['Aves','Mammalia','Reptilia','Amphibia','Chondrichthyes'].includes(c);
  const bucketOf = g => g.cls === 'Aves' ? 'bird' : g.cls === 'Mammalia' ? (g.order === 'Chiroptera' ? 'bat' : g.order === 'Rodentia' ? 'rodent' : 'mam') :
    g.cls === 'Reptilia' ? 'rep' : g.cls === 'Amphibia' ? 'amph' : g.cls === 'Chondrichthyes' ? 'shark' : 'fish';
  const BK = { bird:{T:4.6e10,S:10900,gen:'songbird',lab:'野鳥 約500億羽（Callaghan et al. 2021）'}, bat:{T:5.58e10,S:1450,gen:'bat',lab:'コウモリ 約560億頭（Greenspoon et al. 2023）'},
    rodent:{T:2.2e10,S:2500,gen:'rodent',lab:'ネズミ類 約260億匹（Greenspoon et al. 2023）'}, mam:{T:6e9,S:2400,gen:'shrew',lab:'その他の野生哺乳類 約60億頭（Greenspoon et al. 2023 からの推計）'},
    rep:{T:8e10,S:12000,gen:'lizard',lab:'爬虫類（桁推計）'}, amph:{T:7e10,S:8700,gen:'frog',lab:'両生類（桁推計）'}, fish:{T:1e14,S:35000,gen:'reeffish',lab:'魚類（桁推計）'}, shark:{T:1e9,S:1200,gen:null,lab:'サメ・エイ類（桁推計）'} };
  const groups = {};
  gens.forEach(g => { if (!g.N){ const b = bucketOf(g); (groups[b] = groups[b] || []).push(g); } });
  for (const b in groups){
    const B = BK[b], list = groups[b];
    const share = Math.min(0.5, 3 * list.length / B.S), budget = B.T * share;
    let W = 0; list.forEach(g => { g.w = Math.pow(g.M / 1000, -0.75) * (IUCNM[g.iucn] ?? 0.7); W += g.w; });
    const CAPN = { CR:5e3, EN:1e5, VU:1e6, NT:1e8 };
    list.forEach(g => { g.N = Math.min(CAPN[g.iucn] || Infinity, Math.max(50, budget * g.w / W)); g.src = B.lab + ' のうち' + Math.round(share * 100) + '%を、体重^-0.75（ダムスの法則）とIUCNの危険度で割り振った推計'; g.est = true; });
    if (B.gen){ const o = ORGS.find(x => x.id === B.gen); if (o){ const k = 1 - budget / (o.N + 0); o.N *= Math.max(0.3, k); o.lo *= Math.max(0.3, k); o.hi *= Math.max(0.3, k); } }
  }
  const out = gens.map((g, i) => makeGen(g, i));
  ORGS.push(...out);
}

function makeGen(g, i){
  const key = tplOf(g), tp = TPL[key], cls = g.cls;
  const Lw = g.maxL * (g.capt ? 0.7 : 1), matY = g.mat / Y;
  const m = Math.max(0.25, Lw > matY ? (Lw - matY) / 4 : Lw * 0.3);
  const F = Math.max(g.clutch, g.clutch * g.lpy * m);
  const P = Math.min(0.92, Math.max(1e-8, 2 / F));
  const threat = ['VU','EN','CR'].includes(g.iucn);
  const adultC = Object.assign({}, tp.adult); if (threat){ adultC['生息地の消失'] = (adultC['生息地の消失'] || 0) + 3; }
  const L = tp.lines, facts = [];
  facts.push(`あなたの種の最長寿命の記録は${r1(g.maxL)}年（${g.capt ? '飼育下' : '野生'}）`);
  if (g.iucn && IUCNJ[g.iucn]) facts.push(`あなたの種は、IUCNレッドリストで「${IUCNJ[g.iucn]}」`);
  facts.push(`おとなの体重は約${massText(g)}`);
  let stages, count, clutchN = Math.max(1, Math.round(g.clutch));
  const md = Math.max(30, g.mat);
  if (cls === 'Aves'){
    const nd = Math.max(10, Math.round(g.inc * 1.2));
    stages = [
      { name:'卵', d:g.inc, s:Math.pow(P, 0.2), causes:tp.early, lines:[...L.egg, `卵は1回に約${clutchN}個。${g.inc}日ほど温められて孵る`] },
      { name:'ひな', d:nd, s:Math.pow(P, 0.25), causes:tp.juv, lines:L.juv.slice(0, 1) },
      { name:'若鳥', d:Math.max(30, md - g.inc - nd), s:Math.pow(P, 0.55), causes:tp.juv, lines:[...L.juv.slice(1), `おとなになるのは生後${dur(g.mat)}ごろ`] }];
    count = 2;
  } else if (cls === 'Mammalia'){
    const bd = g.wean || Math.max(20, Math.round(md * 0.15));
    stages = [
      { name: key === 'marsup' ? '袋の中の子' : '赤ちゃん（〜離乳）', d:bd, s:Math.pow(P, 0.45), causes:tp.early, lines:[...L.early, `妊娠期間は約${g.inc}日。1回に生まれるのは${clutchN === 1 ? '1頭' : '約' + clutchN + '頭'}` + (g.bw ? `、生まれたときの体重は約${g.bw >= 1000 ? r1(g.bw / 1000) + 'kg' : Math.round(g.bw) + 'g'}` : '')] },
      { name:'若い個体', d:Math.max(20, md - bd), s:Math.pow(P, 0.55), causes:tp.juv, lines:[...L.juv, `おとなになるのは生後${dur(g.mat)}ごろ`] }];
    count = 0;
  } else if (cls === 'Reptilia'){
    const hd = Math.min(365, Math.round(md * 0.3));
    stages = [
      { name:'卵', d:g.inc, s:Math.pow(P, 0.25), causes:tp.early, lines:[...L.early, `1回に約${clutchN}個の卵。${g.inc}日ほどで孵る`] },
      { name:'子ども', d:hd, s:Math.pow(P, 0.5), causes:tp.juv, lines:L.juv },
      { name:'若い個体', d:Math.max(30, md - hd), s:Math.pow(P, 0.25), causes:tp.juv, lines:[`おとなになるのは生後${dur(g.mat)}ごろ`] }];
    count = 1;
  } else if (cls === 'Amphibia'){
    stages = [
      { name:'卵', d:10, s:Math.pow(P, 0.15), causes:tp.early, lines:[...L.early, `1回の産卵で約${jp(clutchN)}個`] },
      { name: key === 'frogT' ? 'おたまじゃくし' : '幼生', d:60, s:Math.pow(P, 0.45), causes:tp.juv, lines:L.juv.slice(0, 1) },
      { name:'若い個体', d:Math.max(30, md - 70), s:Math.pow(P, 0.4), causes:tp.juv, lines:[...L.juv.slice(1), `おとなになるのは生後${dur(g.mat)}ごろ`] }];
    count = 2;
  } else if (cls === 'Chondrichthyes'){
    stages = [
      { name:'子ども（1歳まで）', d:365, s:Math.pow(P, 0.6), causes:tp.early, lines:[...L.early, `1回に生まれる子は約${clutchN}匹`] },
      { name:'若い個体', d:Math.max(30, md - 365), s:Math.pow(P, 0.4), causes:tp.juv, lines:[...L.juv, `おとなになるのは生後${dur(g.mat)}ごろ。サメの仲間は成長がとても遅い`] }];
    count = 0;
  } else {
    stages = [
      { name:'卵', d:5, s:Math.pow(P, 0.15), causes:tp.early, lines:[...L.early, `母親は1回に約${jp(clutchN)}個の卵を産む`] },
      { name:'仔魚', d:40, s:Math.pow(P, 0.5), causes:tp.juv, lines:L.juv.slice(0, 1) },
      { name:'稚魚・若魚', d:Math.max(30, md - 45), s:Math.pow(P, 0.35), causes:tp.juv, lines:[...L.juv.slice(1), `おとなになるのは生後${dur(g.mat)}ごろ`] }];
    count = 2;
  }
  const adultName = cls === 'Aves' ? '成鳥' : (cls === 'Teleostei' || isFishCls(cls)) ? '成魚' : 'おとな';
  stages.push({ name:adultName, d:m * Y, final:'exp', max:Math.max(m * 1.3, g.maxL - matY) * Y, causes:adultC, lines:[...L.adult, ...facts] });
  const tags = ['animal','multi','vert','gen'];
  if (cls === 'Mammalia') tags.push('mammal');
  if (['Equus caballus','Equus asinus','Bubalus bubalis','Camelus dromedarius'].includes(g.sci)) tags.push('domestic');
  return {
    id:'g' + i, name:g.ja, sci:g.sci, en:g.en, group:CLSJ[cls] || cls, tags, N:g.N, lo:g.est ? g.N / 10 : g.N * 0.7, hi:g.est ? g.N * 10 : g.N * 1.4,
    src:(g.src || '') + '／生活史：AnAge（de Magalhães & Costa 2009）' + (g.imp ? '・一部を体重から推計' : ''), rep:`${g.sci}`,
    count, clutch:clutchN, lpy:g.lpy, tpl:key, size:massText(g), place:tp.place, stages, iucn:g.iucn,
    fec:`1回に約${jp(clutchN)}${cls === 'Mammalia' ? '頭' : '個'}、年に約${r1(g.lpy)}回 → 一生で約${jp(F)}`,
    repro: cls === 'Mammalia' ? '子を産んだ' : (cls === 'Aves' ? '巣をつくり、卵を産んだ' : '卵を産んだ'),
  };
}
function isFishCls(c){ return ['Teleostei','Chondrichthyes','Chondrostei','Holostei','Dipnoi','Cephalaspidomorphi','Coelacanthi','Actinopterygii','Cladistei'].includes(c); }
buildGen();
