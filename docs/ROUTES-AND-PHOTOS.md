# Updating routes and replacing photographs

The interface and route data are separate. You do not need to redesign a page to change a checkpoint image.

## Replace one placeholder

1. Review the photo against `PHOTOGRAPHY-CHECKLIST.md`, including permissions and metadata.
2. Export an ordinary landscape JPEG, preferably around 1,600–2,000 pixels wide and 100–250 KB. These are targets, not enforced limits. Keep useful signs readable on a phone.
3. Copy it into `assets/images/apb-routes/`. Use lowercase letters, hyphens and a `.jpg` extension. Do not just rename an HEIC file to `.jpg`; export or convert it.
4. Open `data/routes.json`, find the checkpoint and change its `image` object. For example, a future verified library approach might use:

```json
"image": {
  "src": "assets/images/apb-routes/library-03-walkway.jpg",
  "alt": "Write a precise description of the actual visible path and landmark here.",
  "isPlaceholder": false
}
```

5. Update that node’s `title`, `instruction` and `landmark` to match the real view. Use a short action plus a recognisable landmark. Remove references to sample illustrations only after verification.
6. Run the project in a local server. Open every route that uses this checkpoint. Check the image, text, cropping and readability on your phone.
7. Commit the photo and JSON changes together. A missing file or mismatched filename causes the fallback to appear; uppercase and lowercase matter on GitHub Pages.

`suggestedPhoto` is an authoring hint, not the displayed image path. The app reads `image.src`. Changing only `suggestedPhoto` will not change the photo. Set `isPlaceholder` truthfully so the image label is correct. JPEG, WebP, PNG and SVG paths under `assets/images/` are accepted; JPEG is a convenient initial photo format.

## Suggested filenames and shared sections

| Checkpoint | Suggested real file |
| --- | --- |
| Shared starting point | `shared-01-start.jpg` |
| Shared walkway | `shared-02-walkway.jpg` |
| Shared junction | `shared-03-junction.jpg` |
| Library branch turn | `library-02-turn-left.jpg` |
| Library walkway | `library-03-walkway.jpg` |
| Library arrival | `library-04-arrival.jpg` |
| Protection Services approach | `security-01-start.jpg` |
| Protection Services public sign | `security-02-arrival.jpg` |
| Computer lab branch | `computer-lab-01-start.jpg` |
| Computer lab building | `computer-lab-02-building.jpg` |
| Computer lab destination | `computer-lab-03-arrival.jpg` |
| Classroom branch | `classroom-01-start.jpg` |
| Classroom destination | `classroom-02-arrival.jpg` |

You can use `library-01-start.jpg` if a library-only start is needed. The demo uses a shared start instead of storing identical starting photos for every destination. Filename numbers are authoring conventions, not the displayed step numbers. The app calculates step numbers from the selected start and graph path.

These suggested file slots describe the sample graph only. Your campus walk may need a different number of checkpoints; add or remove nodes to match reality.

## Add a checkpoint to an existing route

1. Choose a unique ID, for example `library-covered-path`.
2. Add a node inside `nodes` with `title`, `instruction`, `landmark`, `image`, `suggestedPhoto` and `next`.
3. Point the preceding node’s `next` array to the new ID, and point the new node to the following checkpoint.
4. Include the new ID in that route’s `allowedNodeIds`. When a shared path changes, update every affected route’s allowed nodes.
5. Keep branches directed and intentional. Avoid alternate shortcuts: the traversal chooses the path with the fewest node connections, not the shortest real walk or an accessible walk.
6. Run `npm test`. Traverse each affected route in the browser.

For example, replace the connection `library-turn → library-approach` with `library-turn → library-covered-path → library-approach`.

## Add a starting point

Add a record to `starts` in `locations.json` with a unique `id`, a clear `name`, a checkpoint `nodeId` and a `note`. Ensure that every destination has a permitted connected path from that node. Validation rejects disconnected starting points so the interface cannot silently invent directions. If not all destinations are reachable, leave the start out until supported, or explicitly implement per-destination availability.

## Add a destination

Add its location record using the existing fields, then add a route with a unique `id`, `destinationId`, `arrivalNodeId`, `allowedNodeIds`, `isSample`, `verifiedAt` and `summary`. Add its checkpoint nodes and connections. Use the existing icon keys (`book`, `shield`, `monitor`, `classroom`) or add a neutral SVG icon in `app.js`. Update the home destination count, tests, documentation and review scope when expanding beyond the four-destination MVP.

## Route verification and final content

Replacing images does **not** make a route verified. Keep `isSample: true` and `verifiedAt: null` until the actual public route has been walked, photographed, reviewed and authorised for the intended student trial. Check each possible start, public endpoint, access constraints and accessibility separately.

The current interface deliberately includes global sample-route notices and sample-only arrival language. The route `isSample` flag controls some per-checkpoint labels, but changing the flag alone does not remove every sample notice. When real routes are ready, review that global content with the coding partner, update the statuses in `app.js` consistently, and update the sample-specific tests. Keep the student proof-of-concept disclaimer even after route verification.

Never mark an unverified route as ready merely to remove a notice. Record the review date, reviewer role and any limitations without adding unnecessary personal information to a public repository.
