# Publishing horizontal-carousel to npm

The package is published through a **manually-dispatched** GitHub Actions workflow
that resolves the version from the CHANGELOG, validates everything, builds the
exact tarball, and publishes it to npm **with provenance**. The process mirrors
the [outpost](https://github.com/tgoliveira11/outpost) release pipeline.

## Manual only — never automatic

**npm publish and GitHub Releases are never triggered automatically.** The
publish workflow uses `workflow_dispatch` only — there are no `push`, `tag`, or
`release` triggers.

To publish: Actions → **Publish package to npmjs** → Run workflow (on `main`).
See [contributing.md](./contributing.md) for the full branch/PR/release rules.

## Release invariant

Every published version must satisfy:

```
npm @tgoliveira/horizontal-carousel@X.Y.Z  ⟺  git tag vX.Y.Z  ⟺  GitHub Release vX.Y.Z
```

The workflow creates all three in one run (or completes the missing pieces in
**recovery** mode after a failed run).

Package: [`@tgoliveira/horizontal-carousel`](https://www.npmjs.com/package/@tgoliveira/horizontal-carousel)
· Workflow: [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)
· Versioning script: [`scripts/prepare-release.mjs`](../scripts/prepare-release.mjs)

## One-time setup (before the first publish)

The workflow uses **OIDC trusted publishing** — there is **no npm token stored
anywhere**.

1. Create the GitHub Environment named **`npmjs`** in this repo (Settings →
   Environments). The publish job runs under it.
2. On npmjs.com, configure the package's **Trusted Publisher**:
   - **Provider:** GitHub Actions
   - **Repository:** `tgoliveira11/horizontal-carousel`
   - **Workflow filename:** `publish.yml`
   - **Environment:** `npmjs`
3. For the very first publish of a brand-new package name, npm requires you
   to create the package once before trusted publishing can take over (see
   [Bootstrap first publish](#bootstrap-first-publish)).

`package.json` already sets `publishConfig.access = "public"` and
`publishConfig.provenance = true`.

### Bootstrap first publish

Trusted Publisher only applies to **GitHub Actions** (OIDC). The one-time local
bootstrap must **disable provenance** — otherwise npm fails with:

```
Automatic provenance generation not supported for provider: null
```

From the repo root (with `npm login` active). Build first, then publish
immediately with a **fresh** OTP — pass `--otp` on the `publish` command itself
(not only via `NPM_CONFIG_OTP`):

```bash
npm run build
npm publish --access public --provenance=false --ignore-scripts --otp=123456
```

Replace `123456` with the current code from your authenticator (codes expire in
~30 seconds). Do not wait between the two commands.

If publish still fails after several OTP attempts, npm may **rate-limit OTP**
(`429 Too Many Requests - rate limited otp`). Wait 15–30 minutes before trying
again.

### Granular token (recommended if OTP keeps failing)

Create a one-time **Granular Access Token** on npmjs.com:

1. Profile → **Access Tokens** → **Generate New Token** → **Granular Access Token**
2. Permissions: **Read and write** for scope `@tgoliveira` (or this package)
3. Enable **Bypass 2FA**
4. Export and publish:

```bash
npm run build
NPM_TOKEN=npm_xxx npm publish --access public --provenance=false --ignore-scripts
```

(with `//registry.npmjs.org/:_authToken=${NPM_TOKEN}` in the environment or
`~/.npmrc` for that command)

Delete or revoke the token after bootstrap; use **Trusted Publisher** + the
GitHub workflow for subsequent releases.

After this succeeds:

1. Configure **Trusted Publisher** on the package (settings above).
2. Use the **Publish package to npmjs** workflow for all subsequent releases —
   those publishes include provenance via OIDC.

## How to cut a release

1. Land your changes on `main`, with notes under the `## [Unreleased]` section
   of [`CHANGELOG.md`](../CHANGELOG.md).
2. Run the **"Publish package to npmjs"** workflow on `main`. Optionally set
   the `version` input:
   - **blank / `auto`** → version inferred from the Unreleased changelog
   - **`patch` / `minor` / `major`** → bump that part
   - **`x.y.z`** → that exact version (must be greater than the current one)
3. The workflow validates, bumps version (if Unreleased has entries), commits
   release metadata, publishes to npm, tags, and creates a GitHub Release.

### Recovery mode

If `[Unreleased]` is empty, the run enters **recovery mode**: it retries npm
publish, git tag, and GitHub Release for the version already in `package.json`,
with no version bump. Use this after a failed or partial publish.

## What the workflow runs

1. `npm ci`
2. Security audit (`npm run audit:security`)
3. Changelog pre-flight (`scripts/check-release-changelog.mjs`)
4. Version preparation (`scripts/prepare-release.mjs`)
5. `npm run validate` (typecheck, lint, tests + coverage ≥90%, build)
6. `npm pack` → publish exact tarball with provenance
7. Git tag + GitHub Release
