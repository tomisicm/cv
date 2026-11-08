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
src/content/cv.ts                    single source of truth (typed)
        │
        ├── WebResume   → src/app/page.tsx          restyle freely
        └── PrintResume → src/app/print/page.tsx    210 × 297 mm, ATS-safe
                              │
                              └── scripts/generate-pdf.mjs
                                    headless Chrome → page.pdf()
                                    → public/cv.pdf + out/cv.pdf
```

There are two presentations of one document:

- `WebResume` — two columns, responsive, yours to style. Nothing you do here can
  change the PDF.
- `PrintResume` — one column, deliberately plain.

Both read `content/cv.ts`, so the facts exist in exactly one place. Only the
markup is duplicated, which is what makes the two independently restylable.

## The website

`WebResume` is a dark, animated portfolio: split-text hero, aurora backdrop,
scroll reveals, infinite tech ticker, cursor-following spotlight on each role,
and a magnetic PDF button.

Every entrance animation is gated twice:

- `[data-js]` is set by an inline script before first paint, so if JS is
  disabled or fails, nothing is hidden.
- `prefers-reduced-motion: no-preference` wraps the motion CSS, so reduced-motion
  visitors get the finished layout immediately.

There is no animation library. The effects are CSS keyframes plus ~2 KB of
pointer and IntersectionObserver code, which keeps the page at ~449 KB of
uncompressed JS (almost all of it React/Next).

The PDF needs `PrintResume` to be single-column because Chrome emits PDF text in
a global top-to-bottom order: side-by-side blocks interleave, so a copied
paragraph comes out as `the person whoLanguages unblocks a team`. One column
keeps every sentence intact for copy-paste, screen readers, and ATS parsers.

Everything inside both documents is sized in `em`, so only the container changes
`font-size` (15.2px for print, 16px for web).

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
