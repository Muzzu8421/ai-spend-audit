# DEVLOG

## Day 1 — 2026-05-20

**Hours worked:** 2

**What I did:**
Read the full assignment PDF carefully twice. Took notes on every requirement — MVP features, markdown files, rubric weights, git rules. Spent time understanding what Credex actually does (discounted AI infrastructure credits) so the product makes sense as a lead-gen tool, not just a coding exercise. Started researching current pricing for all 8 required AI tools — Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.

**What I learned:**
The assignment is entrepreneurial, not just technical. The rubric weights GTM, economics, and user interviews at 25 points — more than programming skills. That reframed how I'm approaching this. The markdown files are read by an LLM first, so structure and clarity matter as much as content.

**Blockers / what I'm stuck on:**
Not blocked yet, but the pricing research is taking longer than expected. Some vendor pages are inconsistent — Anthropic API pricing in particular has multiple pages that don't fully agree with each other.

**Plan for tomorrow:**
Finish pricing research, finalize PRICING_DATA.md sources, and start sketching the audit engine logic on paper before touching any code.

---

## Day 2 — 2026-05-21

**Hours worked:** 3

**What I did:**
Completed pricing research for all 8 tools. Documented every number with source URLs and verification dates for PRICING_DATA.md. Sketched the audit engine logic — the rules for when a user is on the wrong plan, when a cheaper alternative exists, and when Credex should be surfaced. Also decided on the tech stack: Next.js 15, JavaScript, MongoDB Atlas, Tailwind CSS. Wrote out the data flow from form input → audit engine → results page → lead capture.

**What I learned:**
The audit logic needs to be defensible to a finance person, not just technically correct. I almost wrote "switch to Claude Code" without any usage-fit reasoning — caught that early and added proper conditional logic based on team size and use case.

**Blockers / what I'm stuck on:**
Deciding between Supabase and MongoDB for the backend. MongoDB felt more natural for the audit document structure since each audit result is a nested JSON object.

**Plan for tomorrow:**
Scaffold the Next.js project, set up MongoDB Atlas, and build the spend input form.

---

## Day 3 — 2026-05-22

**Hours worked:** 4

**What I did:**
Scaffolded the Next.js 15 project with Tailwind. Set up MongoDB Atlas cluster, created the database models for audits and leads. Built the spend input form component — supports all 8 required tools with plan selection, monthly spend, and seat count fields. Added localStorage persistence so form state survives page reloads. Started on the audit engine logic file.

**What I learned:**
Next.js 15 has some breaking changes from 14 — particularly around async params in dynamic routes. Had to read the migration docs carefully. Also learned that form state persistence with localStorage needs careful handling for SSR since window is not available server-side.

**Blockers / what I'm stuck on:**
MongoDB connection is throwing an SSL error when connecting from local dev. Tried basic connection string first — no luck. Need to investigate TLS options.

**Plan for tomorrow:**
Fix the MongoDB SSL error and finish the audit engine logic.

---

## Day 4 — 2026-05-23

**Hours worked:** 5

**What I did:**
Spent most of the day debugging the MongoDB SSL error. The error was `MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error`. Formed three hypotheses: (1) wrong connection string format, (2) missing TLS options in the MongoDB client config, (3) IP not whitelisted on Atlas. Tested each one. IP whitelist was fine. Connection string format was correct. The fix was adding explicit TLS options to the MongoClient config in `lib/mongodb.js` — specifically `tls: true`, `tlsAllowInvalidCertificates: false`, and setting `serverSelectionTimeoutMS` to avoid hanging. Once that was fixed, the connection worked consistently.

**What I learned:**
MongoDB Atlas requires explicit TLS configuration in newer driver versions even when the connection string includes `+srv`. The error message was misleading — it looked like a certificate problem but was actually a missing config option.

**Blockers / what I'm stuck on:**
Lost most of the day to the SSL fix. Audit engine is only half done.

**Plan for tomorrow:**
Finish audit engine, build results page, build lead capture component.

---

## Day 5 — 2026-05-24

**Hours worked:** 6

**What I did:**
Finished the audit engine logic — per-tool evaluation for wrong plan, cheaper same-vendor alternative, cheaper cross-vendor alternative, and Credex credit opportunity. Built the AuditResults component with per-tool breakdown, hero savings numbers, and conditional Credex CTA for audits showing >$500/month savings. Built the LeadCapture component with email, company name, role, and team size fields. Added honeypot field for basic abuse protection. Wired up the API routes for `/api/audit` and `/api/leads`.

**What I learned:**
The "you're spending well" case for low-savings audits is actually important UX. First instinct was to skip it but the assignment specifically calls it out — being honest when someone is already optimal builds more trust than manufacturing fake savings.

**Blockers / what I'm stuck on:**
The AI-generated summary via Anthropic API needs an API key I don't currently have access to. Set up the fallback templated summary for now — it handles the API failure gracefully with a rule-based paragraph.

**Plan for tomorrow:**
Build the shareable result URL with Open Graph tags, connect results page to MongoDB, run through the full end-to-end flow, and start on the markdown files.

---

## Day 6 — 2026-05-25

**Hours worked:** 5

**What I did:**
Built the shareable result URL — each audit gets a unique ID stored in MongoDB, the public URL strips email and company name but shows tools and savings numbers. Added Open Graph and Twitter card meta tags to the results page. Connected the results page to MongoDB to fetch audit data by ID. Fixed an ESLint error related to using `<a>` instead of Next.js `<Link>`. Ran through the full end-to-end flow — form → audit → results → lead capture → shareable URL. Everything working. Deployed to Vercel.

**What I learned:**
Open Graph tags need absolute URLs, not relative ones — caught this when the link preview wasn't rendering on Twitter. Also learned that Vercel environment variables need to be set in the dashboard separately from the local `.env.local` file.

**Blockers / what I'm stuck on:**
Need to write all the markdown files tomorrow. Also need to do user interviews and set up GitHub Actions CI.

**Plan for tomorrow:**
Write all required markdown files, conduct user interviews, set up CI workflow, final deploy check, submit.

---

## Day 7 — 2026-05-26

**Hours worked:** 6

**What I did:**
Conducted 3 user interviews via WhatsApp with college contacts — Afaq, Yousef, and Khaled. Wrote USER_INTERVIEWS.md from those conversations. Wrote all remaining markdown files: ARCHITECTURE.md, DEVLOG.md, REFLECTION.md, TESTS.md, PRICING_DATA.md, PROMPTS.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Set up `.github/workflows/ci.yml` for lint and test on every push to main. Wrote 5 audit engine tests. Final Vercel deploy check — URL is live and reachable. Made GitHub repo public. Submitted via Google Form.

**What I learned:**
The entrepreneurial files (GTM, ECONOMICS, USER_INTERVIEWS) took longer than the code. Writing defensible unit economics and a specific GTM plan forces you to actually think about the product as a business, not just a coding exercise. That was the most valuable part of the week.

**Blockers / what I'm stuck on:**
No blockers — submitted.

**Plan for tomorrow:**
Wait for Round 2 results.