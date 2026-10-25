# APB First-Year Visual Navigator

**Student proof of concept — not an official University of Johannesburg service.**

[Open the live prototype](https://lungelo-gif.github.io/apb-first-year-visual-navigator/) · [Source repository](https://github.com/Lungelo-gif/apb-first-year-visual-navigator)

A mobile-first, static prototype for first-year students at Auckland Park Bunting Road Campus. It brings a map-first destination search, a route preview and an immersive photo walk into one experience. It complements UJ’s existing Wayfinder application and separate virtual campus tours.

## Current status

Version 0.4.1 demonstrates four destinations: APB Library, APB Protection Services, a computer laboratory and a classroom. **Every route and starting point is an unverified sample. User-supplied campus, library, public Protection Services sign and lecture-room images are temporary references with unverified locations. The computer lab and all walking checkpoint images remain illustrative placeholders. Do not follow these sample directions on campus.** The exact start, laboratory and classroom remain to be confirmed.

The main screen opens the supplied aerial Bunting Road Campus map as a draggable, zoomable reference. Its original labels and attribution are preserved. A separate “Demo routes” view contains the illustrative pins and highlighted sample paths; invented routes are never placed over real buildings. Destination search and “Start photo walk” work from either view. The large still-image viewer has Forward/Back arrows over the image, Previous/Next controls and written directions. Neither view is a verified current route survey. It is not a true 360° system and does not detect your physical location. An arrival screen confirms the end of the sequence only.

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

- Search by destination name, category or keyword, or select a pin in Demo routes; choose either sample starting location.
- Drag and zoom the supplied campus reference, or switch to Demo routes to review the illustrative highlighted path.
- Review a route summary, checkpoint list and unverified access information.
- Follow large checkpoint images, written directions, overlay arrows and labelled Previous/Next buttons.
- Track progress, return to previous checkpoints, exit and reach an arrival screen.
- Read Help/About and download local feedback as a text file.
- Use semantic controls, visible keyboard focus, a skip link, alternative text and reduced-motion support.
- Recover from unavailable route data, invalid URLs, missing images and empty search results.

The app has no live GPS, analytics, third-party fonts, remote image requests, payments, login, service worker or database. Supplied reference photographs are stored as compressed local assets. Feedback is **not** submitted online. Hosting providers still handle ordinary HTTP requests. Route choices appear in the URL and browser history; they are not stored in a separate application database.

## Project structure

```text
index.html
css/styles.css               Shared theme, content and forms
css/navigator.css            Map and immersive-viewer layouts
js/map-view.js               Campus reference and accessible SVG demo map
js/app.js                    Interface, loading, URL state and controls
js/core.js                   Data validation, search and graph traversal
data/locations.json          Starting points and destination information
data/routes.json             Shared nodes, connections and allowed route nodes
data/map.json                Campus reference metadata and separate demo positions
assets/favicon.svg           Original neutral navigation symbol
assets/images/placeholders/  Lightweight original SVG checkpoint illustrations
assets/images/references/    Supplied reference photos, separate from route photos
assets/images/apb-routes/    Add approved real photographs here
docs/                       Content, photography, testing and deployment guides
tests/routes.test.js         Route integrity and error-handling checks
tests/responsive.html        Actual app in phone/tablet/desktop sized frames
.nojekyll                    Serve the static files directly on GitHub Pages
package.json                 Optional local development/check commands
```

`docs/` and `tests/` extend the requested layout to keep handover material and checks out of interface code. The page uses hash-based navigation and relative asset URLs so it can live under a GitHub Pages repository subpath without server rewrites. There is no framework or build output to keep in sync.

## How route reuse works

Starting locations refer to checkpoint node IDs. Each node has a photo, a direction, a landmark and a list of next node IDs. Each destination route identifies its arrival node and allowed nodes. A breadth-first traversal finds the connected sequence within those allowed nodes. This is an authored demonstration graph, not a geographic or safety-aware routing engine.

The sample layout is drawn from relative X/Y positions in `data/map.json`; they are not latitude/longitude or verified campus coordinates. All four routes reuse `shared-start → shared-walkway → shared-junction`. Changing a shared node updates all routes using it. Choosing the sample central walkway starts at `shared-walkway`, omitting the entrance checkpoint. Shared instructions must apply to every route using that node; put a destination-specific turn in a branch node.

## Handover guides

- [Add or update routes and photographs](docs/ROUTES-AND-PHOTOS.md)
- [Reference image notes and future replacements](docs/REFERENCE-IMAGES.md)
- [Photography checklist](docs/PHOTOGRAPHY-CHECKLIST.md)
- [Testing checklist and current results](docs/TESTING.md)
- [GitHub Pages deployment](docs/DEPLOYMENT.md)
- [Short FYO explanation and future authorised 360° version](docs/FYO-EXPLANATION.md)
- [Decisions, open details and next steps](docs/PROJECT-DECISIONS.md)

## The 360° camera vision

The user’s vision is a familiar map-to-immersive-walk experience: choose a place on a simple map, enter the visual viewer and move forward or backward with arrows. This prototype demonstrates that interaction for a presentation or request for a 360° camera. It currently uses still images, so it cannot look around a panorama. A future authorised version can keep the connected checkpoint graph and replace still-image rendering with genuine captured panoramas and approved hotspots. No live Google map tiles, Google application design, GPS or paid map API are used. The user-supplied campus image retains its original Google Earth and university attribution.

## Before a real campus trial

Confirm the start, destination signs, public access and every walking instruction with appropriate campus staff. Survey accessibility; do not imply step-free access without verification. Walk and review every route in both the app and real surroundings. Replace all placeholders, remove sensitive photo details and strip location metadata before uploading. Do not publish identifiable faces without permission, student cards, information on screens, vehicle registrations, security equipment, access controls or restricted areas.

Protection Services must end at the **public entrance or official sign**. It must never show the inside of the office. Keep the student disclaimer visible. The interface uses a UJ-inspired orange, charcoal and white palette with its own navigation symbol. No standalone UJ logo or official application design was added. Supplied photos may show public signs; their source permissions and APB locations remain to be confirmed.

Do not add real contacts, opening hours, distances, room numbers or walking times until verified. Physical routes, accessibility, image permission and official endorsement have not been verified by this prototype.

## Campus map image — version 0.4

The creator supplied map.jfif (659 × 466 pixels) on 25 October 2026. The exact source bytes are stored as assets/images/references/apb-campus-map-original.jpg. An AI restoration was attempted but changed building names and block markers, so that output is excluded from the app and repository. Zoom cannot recover detail absent from the source; a higher-resolution original is the next image improvement. The image’s source date, reuse permissions and current campus accuracy remain unverified.
