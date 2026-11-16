# Study Companion

Private, invite-only study site for two students in Dubai: a Year 12 Edexcel International A Level student (Maths, Physics, Chemistry; SAT; US astrophysics applications) and a Year 7 student building strong maths and an early path to US universities.

- `site/` is the whole website (no build step). Cloudflare Workers serves it as static assets (`wrangler.jsonc`), and every push to `main` redeploys.
- Access is limited with Cloudflare Access (email one-time PIN); invitees are managed in Cloudflare Zero Trust.
- All dates, plans, syllabus topics and links live in `site/data/study.js`. To update the site, edit that file and push. Dates are `YYYY-MM-DD`, or `YYYY-MM` when only the month is known; `st: "expected"` marks a date that is not yet published.
- Every marked question lives in `site/data/questions.js` (the Question log tab). To add a newly marked paper, add it under `papers` and append its questions; each needs a paper, question number, topic, marks and the tutor's notes.
- Students' progress (topic ratings, scores, study log, roadmap ticks, redone questions, questions they add themselves) is saved in their own browser. The Study log tab has backup and restore.
- `tools/check_site.py` opens the site in a browser on three different dates, visits every tab and fills in every form; run it before pushing (`python3 tools/check_site.py`). Add `?today=YYYY-MM-DD` to the address to preview the site as of another date.
