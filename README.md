# 110穣分の1

地球上のすべての生き物（約1.1×10³⁰）から、次の一生を1つ引いて最後まで生きるシミュレーション。
「80億分の1」（1in8b.life）から着想を得た非公式の派生作品です。

- 公開URL: https://1in1jo.enludus.com/
- `public/` … 公開するファイル（ビルド済みの単一HTML、OGP画像、favicon）
- `src/` … ページの部品。`python3 build.py` で `index.html`（アーティファクト版）と `deploy/index.html`（公開版）を組み立て、`node minify.js` で圧縮
- `tools/` … データ生成（AnAge + Wikidata から約1,050種を作る `gen.py` / `wd.py`）と OGP画像の生成スクリプト

## データ
個体数：Whitman et al. 1998、Bar-On et al. 2018、Flemming & Wuertz 2019、van den Hoogen et al. 2019、Callaghan et al. 2021、Greenspoon et al. 2023、FAOSTAT、UN WPP 2024 ほか。
生活史：AnAge（Human Ageing Genomic Resources）。和名と保全状況：Wikidata（CC0）。
種ごとの個体数の多くは推計（ダムスの法則による割り振り）です。
