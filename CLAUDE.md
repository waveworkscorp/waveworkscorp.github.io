# waveworks-site

WaveWorks company site (Astro, ko/en), served at waveworkscorp.github.io. It lives inside the app-factory monorepo at `sites/waveworks-site` but is its own git repository. Root rules (`../../CLAUDE.md`) still apply when the session is opened from the root.

## Generated files (do not hand-edit)

`npm run site:sync` (run from the app-factory root) owns these paths. The source of truth is each app's `apps/<id>/site/`. Change it there, commit in the app repo, then re-sync.

- `src/data/works.json`
- `public/works/<id>/`
- `src/legal/{ko,en}/<id>/`

Site-wide pages (home, about, contact, shared legal docs directly under `src/legal/{ko,en}/`) are edited here. Format and commands: `../../docs/platform/site-sync.md`.

## Blog

Posts are markdown files: Korean in `src/content/blog/ko/YYYY-MM-DD-<slug>.md` (required), English under the same name in `src/content/blog/en/` (optional; an English-only post fails the build). Covers go in `src/assets/blog/<name>/cover.png`. Frontmatter schema is in `src/content.config.ts`, categories and UI strings in `src/data/blog.ts`. Write posts with the `/blog-auto-write <topic>` skill (`.claude/skills/blog-auto-write/`). It commits locally and opens a preview; push only after the user says "올려". Design: `docs/superpowers/specs/2026-10-31-blog-design.md`.

Every post must meet three criteria, in this order of priority (user decision 2026-10-31). Details are in §0 of the skill.

1. It helps marketing and branding: readers come away wanting to try the work or trusting WaveWorks.
2. It reads as written by a person, with no AI tells.
3. It is easy to read: someone new can follow it in one pass.

The skill runs without asking anything until the final publish approval.

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
- The "다음 작업은?" question in this repo does not include the fixed "update-wiki 후 커밋" option (user instruction 2026-10-31). This overrides the output style's fixed last option.
- Copy in both languages changes together. Facts shown on work pages (ratings, ads, stores) come from the app's `site/site.json`; do not add unverified ones.
