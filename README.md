# The Canadian AI Exposure Map

An Open Nshipyard data story: what public data reveals about AI's likely impact on work in Canada, which skills and trades are most at risk, and which are most likely to thrive.

**Pages**

- `index.html` - the full data story: hero stats, Anthropic's measured task coverage, Canada's exposure split, adoption trends, metro geography, the entry-level squeeze, at-risk vs thriving rankings, an electricians spotlight, AI job-posting growth, a practical training curriculum, methodology and limits, and dated sources.
- `showcase.html` - seven question-and-answer cards, each pairing a one-line answer with the chart behind it.

**Charts** (all numbers fixed from the cited sources; estimates labeled as estimates)

1. Observed AI task coverage by occupation - Anthropic, Massenkoff and McCrory, March 2026 (74.5% programmers, 70.1% customer service, 67.1% data entry)
2. Worker generative-AI use by occupation group - StatCan worker survey, July 30, 2026
3. Firm AI adoption trend and 2026 industry split - StatCan CSBC, Q2 2024 / Q2 2025 / Q2 2026
4. Exposure split of Canadian workers - Mehdi and Morissette, StatCan, 2024 (40% low, 29% augment, 31% compete)
5. Metro AI exposure index - Indeed Hiring Lab, October 2026 (U.S.-skill-data caveat noted)
6. Indexed employment in coding occupations, under-30 vs 30-49 - Mehdi and Frenette, StatCan, January 2026 (illustrative lines)
7. Augmentation vs automation - Anthropic Economic Index, January 2025, plus StatCan CSBC employment effects
8. Electricians spotlight - Kickresume (Sept 2026), MDPI (2026), U.S. BLS 2025-2035 projections, StatCan Leanage and Mehdi (Jan 2026) caveat
9. Postings requiring AI skills - PwC AI Jobs Barometer, Canada cut, 2026

**Design**

National Design Studio register translated to Canada, per `~/workspace/design-language/america-gov-analysis.md`: deep Canadian red `#d80621` (hover `#a80419`), ink navy-black on white, Newsreader display serif at normal weight with tight tracking, Inter Tight sans, 40px card radii, single centered column. Functional EN/FR toggle in the header translates hero, section headlines, and key paragraphs (hand-written French). This is an independent Open Nshipyard project, not a government site: no official-website trust language.

**Build**

```bash
npm run build   # copies src/ into out/ for static hosting
```

`vercel.json` sets `outputDirectory` to `out`. Deployable on Vercel as a static site. No frameworks, no build-time dependencies; charts are hand-rolled SVG generated client-side from fixed data.

**Screenshots**

Generated locally with Playwright (`page.set_content` with inlined CSS, since sandbox Chromium cannot reach localhost):

- `docs/screenshots/index.png` - home page, desktop
- `docs/screenshots/showcase.png` - showcase page, desktop
- `docs/screenshots/index-mobile.png` - home page, mobile
- `docs/screenshots/index-fr.png` - home page, French toggle

## Author

**Richardson Dackam**

- X: [x.com/richardsondx](https://x.com/richardsondx)
- GitHub: [github.com/richardsondx](https://github.com/richardsondx)

An Open Nshipyard data story. Independent research, not affiliated with any government.
