# tomisic-cv

Personal CV as a website, with a build-time export to a **one-page A4 PDF made of
real, selectable text** — not an image.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # static export to out/
pnpm build:pdf    # build, then export public/cv.pdf
pnpm pdf          # export only (requires an existing out/)
pnpm serve        # preview the exported site on :4173
```

## How it works

```
src/content/cv.ts          single source of truth (typed)
        │
        ├── src/app/page.tsx        responsive web version
        └── src/app/print/page.tsx  fixed 210 × 297 mm sheet
                    │
                    └── scripts/generate-pdf.mjs
                          headless Chrome → page.pdf()
                          → public/cv.pdf + out/cv.pdf
```

`CvDocument` is rendered by both routes, so the preview and the PDF cannot drift
apart. Everything inside the document is sized in `em`; only the container
changes `font-size` (15.7px for print, 16px for web).

## The PDF is verified, not assumed

`scripts/generate-pdf.mjs` fails the build unless all of these hold:

1. the content fits inside the A4 sheet (reports how full the page is)
2. the PDF has exactly **1 page**
3. **400+ characters can be extracted back out of it** — a rasterized PDF
   (html2canvas → JPEG → PDF) fails here
4. known content (name, employers, section headings) is present
5. anchors appear in **document order**, so bullets never detach from their job

Current output: 1 page, ~94% of the page height, ~2000 extractable characters.

This matters because an image-based PDF is invisible to ATS parsers, cannot be
selected or searched, and does not reflow.

## Editing

Change `src/content/cv.ts`, then run `pnpm build:pdf`. If the copy grows past one
page, the build fails and tells you by how many millimetres — trim the copy
instead of shrinking the type.

## Notes

- `public/cv.pdf` is a generated artifact and is gitignored.
- The site is a fully static export (`output: 'export'`), so it can be served by
  any static file server or CDN.
