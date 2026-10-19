const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file:///tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/site/deploy/index.html');
  await p.waitForTimeout(2500);
  const data = await p.evaluate(async () => {
    await document.fonts.ready;
    const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 630; const c = cv.getContext('2d');
    c.fillStyle = '#0c1312'; c.fillRect(0, 0, 1200, 630);
    const list = [['rock','cell'],['ocean','crust'],['deep','fish'],['grass','bird'],['ocean','whale'],['city','human']];
    c.imageSmoothingEnabled = false;
    list.forEach(([s, k], i) => { const sc = document.createElement('canvas'); sc.width = 192; sc.height = 80; renderScene(sc, { scene:s, sprite:k, sibs:3, frame:i*7 }); c.drawImage(sc, 40 + i * 190, 400, 180, 75); });
    c.fillStyle = '#4fc2b1'; c.font = '500 26px "Zen Kaku Gothic New"'; c.fillText('地球上のすべての生き物から、ひとつの命を引く', 48, 80);
    c.fillStyle = '#e2ece9'; c.font = '800 190px "Shippori Mincho B1"'; c.fillText('110', 40, 300);
    const w = c.measureText('110').width;
    c.font = '800 120px "Shippori Mincho B1"'; c.fillText('穣', 40 + w, 300);
    const w2 = c.measureText('穣').width;
    c.font = '800 80px "Shippori Mincho B1"'; c.fillText('分の1', 40 + w + w2 + 8, 300);
    c.fillStyle = '#93a5a0'; c.font = '400 24px "Zen Kaku Gothic New"'; c.fillText('細菌に、イワシに、スズメに、ヒトに。何に生まれ、どこまで生きられるか。', 48, 360);
    c.fillStyle = '#93a5a0'; c.font = '400 22px "JetBrains Mono"'; c.fillText('1in1jo.enludus.com', 48, 560);
    c.fillStyle = '#f06aa6'; c.font = '700 26px "Shippori Mincho B1"'; c.textAlign = 'right'; c.fillText('約1,150種の統計データで生きる', 1152, 560);
    return cv.toDataURL('image/png');
  });
  require('fs').writeFileSync('/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/site/deploy/og.png', Buffer.from(data.split(',')[1], 'base64'));
  await b.close();
})();
