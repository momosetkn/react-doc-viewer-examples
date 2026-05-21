# react-doc-viewer-examples

Vite + React + TypeScript で、`react-doc-viewer` の PDF 描画を `react-pdf` に差し替えたサンプルです。

## Setup

```bash
pnpm install
pnpm dev
```

`postinstall` で `pdfjs-dist` の `cmaps` と `standard_fonts` を `public/pdfjs` にコピーします。
手動で再生成したい場合は次を実行してください。

```bash
pnpm copy-statics
```

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
```
