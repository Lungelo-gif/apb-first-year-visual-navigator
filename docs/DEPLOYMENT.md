# Deploy free with GitHub Pages

The project is a buildless static site. Publish the project folder’s **contents**, so `index.html` sits at the repository root. Do not upload a ZIP as the website or put all files inside an extra nested folder.

## First publication

1. Sign into the GitHub account that should own the project.
2. Create a new repository named `apb-first-year-visual-navigator`. For GitHub Free Pages, choose **Public**. Do not include private originals, credentials or unreviewed campus photographs.
3. Upload all project source files, preserving `css/`, `js/`, `data/`, `assets/`, `docs/` and `tests/`. Include `.nojekyll` and `.gitignore`. `package.json` is optional for hosting but useful for checks. No `node_modules` folder is needed.
4. Commit to `main`.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Select `main` and `/ (root)`, then save.
6. Wait for GitHub’s Pages deployment to complete. Use the exact URL shown on the Pages screen; do not assume a site is live merely because files uploaded.
7. Open the live URL on a phone and desktop and complete `TESTING.md`. Refresh a checkpoint URL and confirm all JSON, image and stylesheet files load under the repository subpath.

No custom domain, credit card, Google Maps key or GitHub Actions workflow file is needed for this branch-based setup. GitHub can run its own Pages deployment workflow. Public repositories and their published files can be viewed by others, so review photos before every commit.

## Subsequent updates

Update source or approved photos in the same repository and commit to the publishing branch. GitHub Pages republishes that source. Check the Pages deployment result, then test the changed routes on the live site. Keep the repository and local working copy aligned; avoid making conflicting edits in two places.

When changing CSS or the main JavaScript, update the matching `?v=` release value in `index.html` (currently `0.3.0`) and the package version. Also keep the release value and versioned core-module import in `js/app.js` aligned so JSON and validation code refresh together. This makes returning browsers request the matching updated interface files. Use a new descriptive filename for a replaced photo, then update `image.src`.

## Troubleshooting

- **404 at the site root:** check Settings → Pages, branch, root folder and the presence of a lowercase `index.html` at that source root.
- **Layout or data missing:** verify folder structure and filename case. Keep image and data URLs relative; a leading `/assets` would point outside a project repository’s subpath.
- **Local JSON load error:** use a local HTTP server instead of opening the HTML file directly.
- **Old photos:** check that the latest deployment completed, then refresh. When replacing a cached photo with a different view, a new descriptive filename avoids ambiguity.
- **Missing image:** check `image.src` in `routes.json` and the exact file extension; HEIC must be exported to JPEG rather than renamed.

## Official GitHub references

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Published prototype

Verified on 24 October 2026:

- Repository: https://github.com/Lungelo-gif/apb-first-year-visual-navigator
- Live site: https://lungelo-gif.github.io/apb-first-year-visual-navigator/
- Source: `main` at `/ (root)`, branch-based publication with HTTPS.

The site is deployed with unverified sample routes, illustrative walking checkpoints and user-supplied destination reference photos. Actual phone, campus-route and full accessibility reviews remain separate from deployment verification.
