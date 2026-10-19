logic=open('logic.js').read().replace("ORGS.forEach(prepare);","")
boot = "\nORGS.forEach(prepare);\nstate.lenMin = 3;\ninitUI(); updateHeroOdds(); renderAll(); renderTable(); tickCounter();\n"
js = '\n'.join([open('data.js').read(), logic, open('gen.js').read(), open('genbuild.js').read(), open('stats.js').read(), open('render.js').read(), open('pixel.js').read(), open('texture.js').read(), open('app.js').read(), boot])
foot = open('foot.html').read()
html = open('head.html').read() + open('extra.css').read() + open('body_main.html').read() + open('body_stats.html').read() + foot + "<script>\n" + js + "\n</script>\n"
open('index.html','w').write(html)
print(len(html))

import os
os.makedirs('deploy', exist_ok=True)
head_meta = """<!doctype html>
<html lang="ja"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="地球上のすべての生き物、約1.1×10³⁰の命の中から、あなたの次の一生を1つ引いて最後まで生きるシミュレーション。約1,150種の統計データ入り。">
<meta property="og:type" content="website">
<meta property="og:url" content="https://1in1jo.enludus.com/">
<meta property="og:title" content="110穣分の1 ― すべての生き物から、ひとつの命を引く">
<meta property="og:description" content="細菌、カイアシ類、イワシ、スズメ、クジラ、ヒト。地球の命のどれに生まれ、どこまで生きられるか。">
<meta property="og:image" content="https://1in1jo.enludus.com/og.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://1in1jo.enludus.com/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px;font-family:system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
"""
body = open('index.html').read()
body = body.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
i = body.index('</style>', body.index('/* Layout'))
# head = title + links + styles, then body
split = body.index('<div class="wrap" id="top">')
open('deploy/index.html','w').write(head_meta + body[:split] + '</head><body>\n' + body[split:] + '</body></html>\n')
print('deploy ok', os.path.getsize('deploy/index.html'))
