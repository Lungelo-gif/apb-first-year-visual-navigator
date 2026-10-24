# Project decisions and continuation notes

Last updated: 24 October 2026. This file is the project’s durable decision log; review it when continuing work.

## Agreed scope

- Name: **APB First-Year Visual Navigator**.
- Audience: first-year students at Auckland Park Bunting Road Campus.
- Context: a student proof of concept connected to the author’s FYO Marshal application idea. It complements existing UJ Wayfinder and virtual campus tours.
- Exact visible disclaimer: **Student proof of concept — not an official University of Johannesburg service.**
- HTML, CSS, plain JavaScript modules and separate JSON; free GitHub Pages target.
- No framework, login, payments, database, live GPS, analytics or paid API in the MVP.
- Neutral forest-green, lime and cream identity; original vector placeholder illustrations; no UJ logo or copied design.
- Four destinations: APB Protection Services, APB Library, a selected computer laboratory and a selected classroom.
- All current starts, route directions and endpoints are unverified samples. No real walking times, distances or room numbers are invented.
- Wide sequential checkpoint photos planned with an iPhone 13 Pro Max. The current version is not true 360°.
- Shared node graph with destination-specific permitted paths. The first three checkpoints are reused across all four routes.
- URL-based page/start/step state, without application storage or a backend.
- Feedback downloads a local text file and sends nothing online. No feedback recipient has been configured.
- Protection Services ends at the public entrance or official sign, without interiors, equipment, access controls or restricted details.

## Completed implementation

1. Inspected the empty workspace and confirmed the structure and MVP.
2. Built the responsive interface with clear placeholders and sample notices.
3. Connected search, origin selection, summaries, photo arrows, Previous/Next, progress, exit and arrival.
4. Ran 18 passing route/data checks, including eight start-to-destination combinations.
5. Added photo replacement instructions, route authoring guidance and a photography checklist.
6. Added foundational accessibility controls, Help/About, local feedback and the FYO explanation.

## Pending verification and content

- Browser/phone testing and measured contrast review. The workspace’s managed preview service is unavailable (missing preview daemon mailbox); do not claim browser QA passed.
- Exact official/public starting point and its photo.
- Exact computer laboratory building and room.
- Exact classroom building and room.
- Verified public library endpoint and Protection Services endpoint.
- Real checkpoint photographs after the student’s planned Monday photography window.
- Campus permissions, route walk-through, accessibility review and any verified hours/access notes.
- Review global sample wording when real routes are validated; `isSample` alone intentionally does not remove all sample notices.

## GitHub and deployment

- Confirmed owner: `Lungelo-gif`, selected by the project creator.
- Repository: `apb-first-year-visual-navigator` (public).
- Repository URL: https://github.com/Lungelo-gif/apb-first-year-visual-navigator
- Publishing source: intended `main` at `/ (root)`.
- Live GitHub Pages URL: pending verification.
- Deployment status: source upload and Pages configuration in progress.

## Next working session

Upload the reviewed source, enable Pages from `main` at `/ (root)`, verify its returned deployment URL, and test all four sample routes in the browser. Test on an actual phone before calling the mobile experience verified. When real campus details and photographs arrive, replace data/assets and validate every route before removing sample labels.
