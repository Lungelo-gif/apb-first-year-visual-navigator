# APB First-Year Visual Navigator

**Student proof of concept — not an official University of Johannesburg service.**

A mobile-first, static prototype for first-year students at Auckland Park Bunting Road Campus. It brings destination search, short written directions and sequential visual checkpoints into one experience. It complements UJ’s existing Wayfinder application and separate virtual campus tours.

## Current status

Version 0.1 demonstrates four destinations: APB Library, APB Protection Services, a computer laboratory and a classroom. **Every route and starting point is an unverified sample. All images are original illustrative placeholders, not APB photographs. Do not follow these sample directions on campus.** The exact start, laboratory and classroom remain to be confirmed.

The visual flow uses wide still photographs with Previous and Next controls. It is not a true 360° system and does not detect your physical location. An arrival screen confirms the end of the sequence only.

## Try it locally

1. Download and extract this project.
2. Open a terminal in this folder.
3. Run `python3 -m http.server 8000` (on Windows, `py -m http.server 8000` may be appropriate).
4. Open `http://localhost:8000`.

Keep the terminal open while testing. Stop the server with Ctrl+C. Opening `index.html` directly as a `file://` URL will usually block JSON loading; use the server. Python is a local development convenience, not an application backend.

The deployed app needs no installation, build step, account, paid API or database. It uses browser-native HTML, CSS, JavaScript modules and JSON. Node.js is optional and only needed for the included checks:

```sh
npm test
npm run check
```

There are no npm dependencies to install. For a repeatable phone-width preview, open `tests/responsive.html` through the same server. It embeds the actual app at 320, 375, 390, 768 or 1,440 CSS pixels; an actual phone check is still needed.

## What works

- Search by destination name, category or keyword; choose either sample starting location.
- Review a route summary, checkpoint list and unverified access information.
- Follow large checkpoint images, written directions, overlay arrows and labelled Previous/Next buttons.
- Track progress, return to previous checkpoints, exit and reach an arrival screen.
- Read Help/About and download local feedback as a text file.
- Use semantic controls, visible keyboard focus, a skip link, alternative text and reduced-motion support.
- Recover from unavailable route data, invalid URLs, missing images and empty search results.

The app has no live GPS, analytics, third-party fonts, external imagery, payments, login, service worker or database. Feedback is **not** submitted online. Hosting providers still handle ordinary HTTP requests. Route choices appear in the URL and browser history; they are not stored in a separate application database.

## Project structure

```text
index.html
css/styles.css
js/app.js                    Interface, loading, URL state and controls
js/core.js                   Data validation, search and graph traversal
data/locations.json          Starting points and destination information
data/routes.json             Shared nodes, connections and allowed route nodes
assets/favicon.svg           Original neutral navigation symbol
assets/images/placeholders/  Lightweight original SVG illustrations
assets/images/apb-routes/    Add approved real photographs here
docs/                       Content, photography, testing and deployment guides
tests/routes.test.js         Route integrity and error-handling checks
.nojekyll                    Serve the static files directly on GitHub Pages
package.json                 Optional local development/check commands
```

`docs/` and `tests/` extend the requested layout to keep handover material and checks out of interface code. The page uses hash-based navigation and relative asset URLs so it can live under a GitHub Pages repository subpath without server rewrites. There is no framework or build output to keep in sync.

## How route reuse works

Starting locations refer to checkpoint node IDs. Each node has a photo, a direction, a landmark and a list of next node IDs. Each destination route identifies its arrival node and allowed nodes. A breadth-first traversal finds the connected sequence within those allowed nodes. This is an authored demonstration graph, not a geographic or safety-aware routing engine.

All four routes reuse `shared-start → shared-walkway → shared-junction`. Changing a shared node updates all routes using it. Choosing the sample central walkway starts at `shared-walkway`, omitting the entrance checkpoint. Shared instructions must apply to every route using that node; put a destination-specific turn in a branch node.

## Handover guides

- [Add or update routes and photographs](docs/ROUTES-AND-PHOTOS.md)
- [Photography checklist](docs/PHOTOGRAPHY-CHECKLIST.md)
- [Testing checklist and current results](docs/TESTING.md)
- [GitHub Pages deployment](docs/DEPLOYMENT.md)
- [Short FYO explanation and future authorised 360° version](docs/FYO-EXPLANATION.md)
- [Decisions, open details and next steps](docs/PROJECT-DECISIONS.md)

## Before a real campus trial

Confirm the start, destination signs, public access and every walking instruction with appropriate campus staff. Survey accessibility; do not imply step-free access without verification. Walk and review every route in both the app and real surroundings. Replace all placeholders, remove sensitive photo details and strip location metadata before uploading. Do not publish identifiable faces without permission, student cards, information on screens, vehicle registrations, security equipment, access controls or restricted areas.

Protection Services must end at the **public entrance or official sign**. It must never show the inside of the office. Keep the student disclaimer visible. Use a neutral visual identity; no UJ logos, copied protected imagery or copied application design are included.

Do not add real contacts, opening hours, distances, room numbers or walking times until verified. Physical routes, accessibility, image permission and official endorsement have not been verified by this prototype.
