# waveworks-site

WaveWorks company site (Astro, ko/en), served at waveworkscorp.github.io. It lives inside the app-factory monorepo at `sites/waveworks-site` but is its own git repository. Root rules (`../../CLAUDE.md`) still apply when the session is opened from the root.

## Generated files (do not hand-edit)

`npm run site:sync` (run from the app-factory root) owns these paths. The source of truth is each app's `apps/<id>/site/`. Change it there, commit in the app repo, then re-sync.

- `src/data/works.json`
- `public/works/<id>/`
- `src/legal/{ko,en}/<id>/`

Site-wide pages (home, about, contact, shared legal docs directly under `src/legal/{ko,en}/`) are edited here. Format and commands: `../../docs/platform/site-sync.md`.

## Check

- `npx astro build`, then `npx astro preview --port 4329`. Preview serves `dist/`, so build first. Stop the preview when done.
- Skip `npx astro check`; the build is the check.
- Mobile: the Chrome window cannot be shrunk below desktop width. Load the page in a 390px-wide iframe instead.

## Deploy

A push to `main` deploys via GitHub Pages (`.github/workflows/`). Keep `astro-site` at the same commit.

```
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q origin HEAD:main HEAD:astro-site
gh run list -R waveworkscorp/waveworkscorp.github.io -L 1
```

Runs share one `pages` concurrency group and deploy in order. A run stuck in `queued` is usually a GitHub Actions incident (check githubstatus.com), not a site problem.

## Rules

- `git add` by path. Never commit `.omc/`.
- No `update-wiki`, `docs/STATE.md` or wiki for this repo (user decision 2026-10-31). Pending site work goes in one line of the root `docs/STATE.md`.
- Copy in both languages changes together. Facts shown on work pages (ratings, ads, stores) come from the app's `site/site.json`; do not add unverified ones.
