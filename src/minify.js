const { minify } = require('/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/tools/node_modules/terser');
const fs = require('fs'), z = require('zlib');
(async () => {
  let h = fs.readFileSync('deploy/index.html', 'utf8');
  const a = h.lastIndexOf('<script>'), b = h.lastIndexOf('</script>');
  const js = h.slice(a + 8, b);
  const m = await minify(js, { compress: true, mangle: { toplevel: false } });
  h = h.slice(0, a + 8) + m.code + h.slice(b);
  h = h.replace(/\n\s+/g, '\n');
  fs.writeFileSync('deploy/index.html', h);
  const br = q => z.brotliCompressSync(q, { params: { [z.constants.BROTLI_PARAM_QUALITY]: 11, [z.constants.BROTLI_PARAM_LGWIN]: 24 } });
  const payload = { 'index.html': br(Buffer.from(h)).toString('base64'), 'og.png': fs.readFileSync('deploy/og.png').toString('base64'), 'favicon.svg': fs.readFileSync('deploy/favicon.svg').toString('base64') };
  const build = `const z=require('zlib'),fs=require('fs');fs.mkdirSync('public',{recursive:true});const P=${JSON.stringify(payload)};for(const k in P){let b=Buffer.from(P[k],'base64');if(k==='index.html')b=z.brotliDecompressSync(b);fs.writeFileSync('public/'+k,b);}console.log('ok');\n`;
  fs.writeFileSync('deploy/build.js', build);
  console.log('html', h.length, 'build.js', build.length);
})();
