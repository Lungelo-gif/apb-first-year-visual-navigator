# Project decisions and continuation notes

Last updated: 24 October 2026. This file is the project’s durable decision log; review it when continuing work.

## Agreed scope

- Name: **APB First-Year Visual Navigator**.
- Audience: first-year students at Auckland Park Bunting Road Campus.
- Context: a student proof of concept connected to the author’s FYO Marshal application idea. It complements existing UJ Wayfinder and virtual campus tours.
- Exact visible disclaimer: **Student proof of concept — not an official University of Johannesburg service.**
- HTML, CSS, plain JavaScript modules and separate JSON; free GitHub Pages target.
- No framework, login, payments, database, live GPS, analytics or paid API in the MVP.
- Updated at the user’s request to a UJ-inspired orange, charcoal and white palette. Keep the prototype’s own navigation symbol and exact unofficial-service disclaimer.
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
7. Created the public repository under the confirmed owner, Lungelo-gif, and enabled GitHub Pages from main at the root.
8. Verified eight live sample journeys, search, navigation, arrival, feedback download and invalid-URL recovery.
9. Checked six screens at five viewport widths using tests/responsive.html, fixed the keyboard skip link, and placed the exact disclaimer near the top of every screen.
10. Versioned interface/data URLs so updated entry pages request matching assets. Current release: 0.3.0.
11. Added four user-supplied reference images on 24 October 2026: campus buildings, library, public Protection Services sign and lecture room. The campus image is a building-only crop and the security image is a public-sign-only crop.
12. Store references in assets/images/references/ and destination/campus image metadata in locations.json. Reference images appear on home cards, summaries and arrival screens. All walking checkpoint nodes and route instructions remain sample data; the computer lab keeps its existing placeholder.
13. Verified the deployed version 0.2: all four destination photo journeys work, the six main screens fit five tested viewport widths, and the common notice/button/footer contrast ratios remain readable. All 33 release files matched the working source.

## Clarified interface vision — version 0.3

The user originally pictured a Google Maps-like navigation experience with a Street View-like visual walk. The prototype should help demonstrate the idea to obtain a 360° camera. Implement the common interaction pattern with this project’s own UJ-inspired identity: map first, choose a destination, preview the route, then move through an immersive viewer using on-image Forward/Back arrows.

The map is a draggable, zoomable schematic sample stored in data/map.json, not an APB survey. All pins, routes and map positions remain unverified. The viewer uses ordinary still images and clearly states that it is a still-photo demo. It does not simulate panoramic look-around or claim actual 360° capture. Keep the supplied reference photos, graph reuse, keyboard controls, exact disclaimer, free static architecture and existing GitHub Pages site. No Google API, Google imagery, live GPS or new backend was added.

Version 0.3 was published to the existing GitHub Pages site on 24 October 2026. All 21 automated route/data checks and JavaScript syntax checks passed. Live Chrome testing completed all eight sample journeys and checked map search, pins, drag, zoom/reset, Forward/Back, keyboard navigation and exit. The six main screens had no horizontal overflow at five phone/tablet/desktop widths. Physical iPhone/Safari, VoiceOver and real-campus verification remain pending. Source changes were compared with the repository using Git blob hashes.

## Pending verification and content

- Physical iPhone/Safari, VoiceOver and a complete accessibility audit remain pending. Live Chrome testing and common rendered-text contrast measurements are complete.
- Loading under throttled conditions and deliberate missing-image/data failure injection remain manual checklist items.
- Exact official/public starting point and its photo.
- Exact computer laboratory building and room.
- Exact classroom building and room.
- Verified public library endpoint and Protection Services endpoint.
- Actual sequential route photographs will be supplied later. Existing reference photos do not verify campus locations, endpoints or directions.
- Campus permissions, route walk-through, accessibility review and any verified hours/access notes.
- Review global sample wording when real routes are validated; `isSample` alone intentionally does not remove all sample notices.

## GitHub and deployment

- Confirmed owner: `Lungelo-gif`, selected by the project creator.
- Repository: `apb-first-year-visual-navigator` (public).
- Repository URL: https://github.com/Lungelo-gif/apb-first-year-visual-navigator
- Publishing source: `main` at `/ (root)`.
- Live GitHub Pages URL: https://lungelo-gif.github.io/apb-first-year-visual-navigator/
- Deployment status: live; the deployed app was opened and its sample journeys verified on 24 October 2026.

## Next working session

Test the live site on an actual iPhone/Safari and with VoiceOver. Complete the remaining manual error/loading checks. Gather the exact APB start, laboratory, classroom and approved photos, then update data/assets and walk every route before removing sample labels. Use the existing repository and Pages site; do not create another repository for normal updates.
