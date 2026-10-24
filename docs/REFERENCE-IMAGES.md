# Supplied reference images — version 0.2

These files were supplied by the project creator on 24 October 2026 for the prototype. They are temporary campus/destination references, not verified APB route checkpoints. The lab photo and actual sequential route photographs will be supplied later.

| Supplied file | Published web asset | Preparation and use |
| --- | --- | --- |
| APB Campus.jpg | `assets/images/references/campus-reference.jpg` | Building-only crop, 1,280 × 396 pixels; excludes the people and entrance/access controls. Home hero, labelled location unverified. |
| UJ library.jfif | `assets/images/references/library-reference.jpg` | JPEG export, 398 × 502 pixels; retain portrait proportions. Library card, summary and arrival reference. |
| Protection services.jfif | `assets/images/references/security-sign-reference.jpg` | Public-sign-only crop, 169 × 101 pixels; no office interior or equipment. Protection Services card, summary and arrival reference. This supplied image has limited resolution. |
| Lecture room found.jfif | `assets/images/references/classroom-reference.jpg` | JPEG export, 450 × 680 pixels; empty-room photo retained in portrait proportions. Classroom card, summary and arrival reference. The sign in the image does not establish the chosen APB room. |

The exported web files total about 196 KB. EXIF metadata was removed. Full original attachments are outside the website repository. The exports preserve photographed content; no new campus scene or landmark was generated.

The source campus image shows entrance labels that do not establish an APB location. Do not use its filename as location evidence. The reference photos' original authors, permissions and exact campus locations have not been verified by the application. Keep the visible reference labels until appropriate confirmation, and keep the student disclaimer even after that confirmation.

## Replacing these references

1. Add a reviewed, appropriately permitted destination photo to `assets/images/references/` using a new descriptive filename.
2. Update `campusImage` or the destination's `image` object in `data/locations.json`.
3. Set accurate alternative text, dimensions, label and placeholder status.
4. Check the home card, route summary and arrival view on a phone.

## Adding the actual walking photographs later

Use `assets/images/apb-routes/` and update the corresponding node images in `data/routes.json`. Follow `ROUTES-AND-PHOTOS.md` and `PHOTOGRAPHY-CHECKLIST.md`. A reference destination image must not be treated as proof that the sample turns, starting point or arrival node are correct. The computer-lab placeholder and all sample checkpoint images remain available until those real photographs arrive.

The new UI uses a UJ-inspired orange, charcoal and white palette with darker orange for readable white button text. It retains the project's own navigation symbol and does not claim official UJ brand approval.
