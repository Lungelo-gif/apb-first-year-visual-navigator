# Short project explanation for the FYO team

APB First-Year Visual Navigator is a student proof of concept developed from an idea connected to my FYO Marshal application. It explores how first-year students could find lecture rooms, computer laboratories and campus services through a simple destination search, short written directions and recognisable checkpoint photographs.

A student chooses a starting point and destination, reviews a route summary, then moves through one checkpoint photo at a time with Previous and Next controls. The first demonstration includes APB Library, the public-facing Protection Services endpoint, a selected computer laboratory and a selected classroom. It is designed for a phone, with no login, live GPS or paid map service.

UJ already provides a Wayfinder application and separate virtual campus tours. This project complements those existing tools by demonstrating one focused first-year visual navigation journey. The current images and directions are clearly labelled samples. Real routes must be confirmed, photographed with permission, reviewed for privacy and checked in person before a campus trial.

The planned photos are wide still images taken at checkpoints using an iPhone 13 Pro Max. This version is not a true 360° tour. Its purpose is to test whether simple visual checkpoints make a first-year student feel more confident about their next step.

**Student proof of concept — not an official University of Johannesburg service.**

## A short demonstration

1. Open the app and point out the student disclaimer and sample-route notice.
2. Choose the sample starting point, search for “library” and open the route summary.
3. Show the checkpoint count, written instruction, photo, large arrows and progress.
4. Go back one checkpoint, then finish the sample sequence.
5. Explain that arrival confirms the end of the sequence, not GPS detection.
6. Show Help/About and the locally downloaded feedback form.

## Future authorised 360° version

- Seek permission and collaboration with relevant UJ campus, facilities, accessibility and student-support teams. Agree on how the prototype relates to existing Wayfinder and virtual-tour services.
- First validate the real still-photo MVP with first-year students and authorised reviewers. Record confusing checkpoints, route restrictions and accessibility needs.
- If justified, capture genuine panoramas with suitable equipment and an approved capture plan. Ordinary wide photos do not become true 360° imagery merely by placing arrows on them.
- Keep the existing node IDs and connections. Extend each node’s image metadata with a media type, panorama file, initial viewing direction and approved hotspots. The interface can then choose between a still-photo viewer and a panorama viewer.
- Evaluate an accessible, maintained panorama viewer after requirements and current licensing have been checked. Retain written directions, keyboard controls and a still-image alternative. Do not choose an expensive API by default.
- Compress or tile panoramas and load them on demand. Keep the still-photo mode for low-data users.
- Review faces, information, security-sensitive details and location metadata again. Panoramas reveal more of the surroundings, so their review burden is higher.
- Establish who owns content, authorises routes, handles corrections and updates images after construction or access changes. Only use official branding or claims of endorsement with permission.
