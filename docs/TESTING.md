# Testing checklist

## Initial release results — 24 October 2026

`npm test`: **18 checks passed**. `npm run check`: JavaScript syntax checks passed. The checks cover all four destinations from both sample starts (eight paths), shared-node reuse, terminal public security endpoint, existing image files, search aliases, no-result searches, cycles, disconnected nodes, invalid data and HTML escaping.

Live Chrome browser checks passed for all eight start/destination combinations. Every sample checkpoint image loaded, step counts matched, the first Previous control was disabled, and all arrivals showed the correct destination. Search/clear/no-result states, overlay Next, Previous, keyboard arrows, Escape exit, Help, local feedback download and its file contents, invalid destinations/starts/steps, reload and browser Back/Forward were checked.

The actual app was embedded with `tests/responsive.html` at **320, 375, 390, 768 and 1,440 CSS pixels**. Home, summary, checkpoint navigation, arrival, Help and feedback had no horizontal overflow. Phone checkpoint buttons measured 47 px high; photo arrows measured 46 × 46 px. These are responsive browser checks, not an actual iPhone/Safari test.

The keyboard skip link initially collided with hash routing. It was fixed and verified to focus main content without changing the current route. The exact disclaimer now appears near the top of every screen as well as the footer. Versioned CSS/JavaScript URLs prevent a new entry page from using an older cached interface release.

Common rendered navigation text contrast ratios were measured: disclaimer 7.67:1, demo banner 6.67:1, step count 10.59:1, checkpoint heading 11.50:1, landmark text 5.75:1, primary button 9.76:1 and footer 5.29:1. This is not a full accessibility audit. No application-origin console errors were observed; browser-extension messages were excluded.

The uploaded source was compared with the local files using Git blob hashes. The local managed preview service was unavailable, so browser checks used the real GitHub Pages deployment instead. Remaining manual work includes an actual phone/Safari check, VoiceOver, 200% zoom, reduced-motion behaviour, network throttling, deliberate missing-image/data failures and all real-campus verification.

## Version 0.2 image and theme update

The user requested four supplied images and a UJ-inspired orange, charcoal and white theme. All four web exports are JPEGs with no EXIF metadata and total about 196 KB. Campus people/entrance controls were excluded from the building crop, and Protection Services uses a public-sign-only crop. Portrait library and lecture-room photos use contain fitting. Route nodes and instructions remain unchanged, with the existing computer lab placeholder. The 18 route/data checks and JavaScript syntax checks passed after implementation. Live version 0.2 checks passed for all four destinations: each card, summary and arrival showed the intended reference image, the lab kept its original placeholder, and sample walking checkpoints remained separate. Home cards, portrait summary, checkpoint navigation, photo arrival, Help and feedback passed no-horizontal-overflow checks at 320, 375, 390, 768 and 1,440 CSS pixels. The new palette measured 7.74:1 for the disclaimer, 8.12:1 for the demo notice, 5.89:1 for the primary button and 5.79:1 for footer text. All 33 repository files matched the local source after the release upload. These checks do not replace the pending real iPhone/Safari, VoiceOver and campus-route reviews.

## Version 0.3 map and immersive-walk update

Implemented a draggable/zoomable schematic map, searchable destination list, keyboard-accessible SVG pins, highlighted route overview and a still-image viewer with Forward/Back arrows directly over the image. Added data/map.json, js/map-view.js and css/navigator.css. Route graph and supplied reference photographs remain separate and unchanged. `npm test`: 21 checks passed, including map-position validation. JavaScript syntax checks passed.

Published and opened version 0.3 on GitHub Pages. Live Chrome checks passed for all eight start/destination combinations: every checkpoint image loaded, step counts matched, the first Back control was disabled and all arrivals showed the correct destination. Search filtered both the list and pins; clearing restored all four. Destination-pin selection, highlighted route, zoom/reset, map dragging, on-image Forward/Back, keyboard ArrowUp and Escape exit were checked. A test initially read an image before its loading state finished; waiting for the loading indicator to clear confirmed the image loaded successfully.

Home/map, route overview, photo walk, arrival, Help and feedback had no horizontal overflow at 320, 375, 390, 768 and 1,440 CSS pixels. Screenshots of the phone map, phone viewer, desktop route map and desktop viewer were inspected. Phone photo arrows measured 75 px high and the instruction dock remained inside the 844 px test viewport. Browser extension errors were present; no application-origin error was observed. These are browser-responsive checks, not physical iPhone/Safari or VoiceOver verification. Deliberate missing-image/data failure injection, throttled loading and the other unchecked manual items below remain pending. The local managed preview service was unavailable, so browser checks used the real Pages deployment.

Manual release checks: map search and pin selection, both origins, zoom/reset, map drag, each destination’s route overview, Forward/Back and Previous/Next controls, keyboard arrows/Escape, arrival/return, small-screen overlap and visibility, image/error states, Help and feedback. Check that the sample map notice, still-photo-demo label and exact student disclaimer stay visible.

## Core journey — repeat for all four destinations

- [x] From sample campus entrance, choose the destination and check the summary’s start/end and count.
- [x] Start navigation. Check every photo, written direction and visible sample label.
- [x] The first Previous button and over-photo previous arrow are disabled.
- [x] Use Next and Previous; image, instruction, landmark, progress and step number stay aligned.
- [x] The last checkpoint offers “Finish demo route”, then shows the correct destination and useful information.
- [x] Arrival is worded as completing a sample sequence, not detecting a real location.
- [x] Return home and select a different destination.
- [x] Repeat from sample central walkway; the shared entrance is skipped and step counts adjust.
- [x] Exit halfway through, then start again. No stale checkpoint appears.
- [x] Reload a summary or checkpoint URL and use browser Back/Forward. Route and selected start remain consistent.

Expected sample counts:

| Destination | Sample campus entrance | Sample central walkway |
| --- | --- | --- |
| APB Library | 6 | 5 |
| APB Protection Services | 5 | 4 |
| APB Computer Laboratory | 6 | 5 |
| APB Classroom | 5 | 4 |

## Search, help and feedback

- [x] Search “security” and an unknown phrase in the browser; results match. Other aliases passed the automated search checks.
- [x] Type an unknown place; helpful suggestions and Clear search appear.
- [x] Clear the query, including with the clear button, and all destinations return.
- [x] Open Help/About; the disclaimer, sample limitations, still-photo explanation and privacy notes are readable.
- [ ] Feedback requires a rating and a comment of 10–1,500 characters.
- [x] Submit ordinary test feedback. A text file downloads, includes the entered comments and states that nothing was submitted online.
- [x] The form does not ask for a name, email address or student number.

## Error and loading states

- [ ] In browser developer tools, throttle the network and reload. Loading text appears before data or photos arrive.
- [ ] Temporarily use a nonexistent `image.src` in a test copy. A missing-photo message and retry control appear, written directions remain usable, and the app does not skip a checkpoint.
- [ ] Restore the image and retry successfully.
- [ ] Temporarily break a JSON file in a test copy, then reload. A data error offers retry; it does not display invented route details.
- [ ] Restore the JSON and reload/retry successfully.
- [x] Visit `#navigate/library?from=sample-entrance&step=999` and `#route/unknown`; useful recovery links appear.
- [x] Test an invalid starting point in the URL. It gives an error instead of substituting another origin silently.
- [x] Test a repository subpath on GitHub Pages; assets and JSON use relative paths correctly.

## Accessibility and layouts

- [x] Test widths of 320, 375, 390, 768 and 1,440 CSS pixels. No essential controls are clipped and no horizontal scrolling is needed.
- [ ] Use an actual iPhone/Safari and desktop browser. Check both phone orientations.
- [ ] Increase browser zoom to 200%. Text reflows and navigation remains operable.
- [ ] Use only the keyboard: skip link, origin select, search, cards, navigation, Help and feedback.
- [ ] Focus outlines remain visible. After a page/step change, focus returns to main content.
- [x] Arrow keys and Escape work in navigation.
- [ ] Check keyboard shortcuts do not interfere with typing or the location selector on an actual device.
- [ ] Use VoiceOver or another screen reader. Check labels, heading order, current navigation, status announcements, step number and image descriptions.
- [ ] Verify foreground/background contrast using an accessibility checker, especially small muted text and photo overlay labels. CSS intends readable contrast; measurement is still required.
- [x] Measure over-photo controls at phone widths: at least a 46-pixel target.
- [ ] Test those controls one-handed on an actual phone.
- [ ] Enable reduced motion; decorative motion is suppressed.

## Low-data and release review

- [ ] Inspect network requests: no external fonts, trackers, live maps or paid APIs.
- [ ] Navigation loads its current image without preloading a whole photo route.
- [ ] Check exported real-photo sizes and legibility; strip metadata before upload.
- [ ] No console errors, broken assets or exposed private information.
- [ ] All four real routes are walked and authorised before claiming route accuracy.
- [x] Keep the exact student disclaimer visible, including on route and arrival screens.
- [ ] Update this document with the date, browser/device and outcome of each completed manual test. Do not mark a check complete based only on a unit test.
