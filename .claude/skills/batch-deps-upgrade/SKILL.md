---
name: batch-deps-upgrade
description: Batch all open Dependabot dependency upgrade PRs into a single PR, plus any further upgrades needed to resolve open Semgrep JIRA tickets that a package upgrade can fix
disable-model-invocation: true
---

Batch all open Dependabot dependency upgrade PRs into a single PR for this repository, **plus any further upgrades needed to resolve the open Semgrep JIRA tickets that a package upgrade can fix**.

**Scope — only tickets a package upgrade can fix:** ones naming a vulnerable dependency. The fix version comes from the ticket or, when the ticket omits it, from the ticket's GitHub advisory.

Within that scope, the two inputs are independent. Every in-scope ticket gets fixed whether or not a Dependabot PR happens to propose that upgrade. Where no open Dependabot PR covers an impacted package, this PR adds the upgrade itself.

**Two modes — decide which before doing anything else.** The invocation argument arrives as `ARGUMENTS`:

- **empty** (`/batch-deps-upgrade`) — run Steps 1-4, then **stop**. Do not continue into "Closing run" even though it appears further down; this mode writes nothing to JIRA or GitHub, only the working tree and local files.
- **`close`** (`/batch-deps-upgrade close`) — run **only** "Closing run" at the bottom. No discovery, no branch, no install, no tests. Normally used after the batch PR merges.
- **anything else** — stop and ask which was meant. Do not guess.

Requires `gh auth login` and, for the Semgrep parts, the Atlassian MCP.

## Step 1: Discover

Run: gh pr list --repo ripple/explorer --label dependencies --state open --limit 500 --json number,title,headRefName,body,url

Parse each PR to extract package names and versions. Dependabot PRs come in two formats:

- **Single-package PRs**: title is `Bump <pkg> from <old> to <new>` — parse from title
- **Grouped PRs**: title is `bump <pkg1> and <pkg2>` with no versions — parse from PR body, which contains a structured list of package updates with version ranges

If any PR can't be parsed from either title or body, flag it for manual review. Build a table of all proposed upgrades. Report the table to the user before proceeding.

Also fetch the Semgrep tickets per **Where the list comes from** under "Semgrep tickets" below, and add them to the same table. Zero open Dependabot PRs is not a reason to stop — the tickets alone can justify the batch.

## Step 2: Apply

**Before starting:** Switch npm to the public registry so that `npm info` and `npm install` work without VPN access to Ripple's internal Artifactory:

```
npm config set registry https://registry.npmjs.org/
```

**After Step 3 completes:** Restore the original registry:

```
npm config set registry https://artifactory.ops.ripple.com/artifactory/api/npm/ripple-npm/
```

1. Create a branch from main: deps/batch-deps-upgrade-YYYY-QN (use current year and quarter)
2. Check for **peer dependency conflicts** before upgrading. For each proposed upgrade:
   - Run `npm ls <pkg>` to see the currently installed version and what depends on it.
   - Run `npm info <pkg>@<new-version> peerDependencies` to fetch the proposed version's peer deps.
   - If the proposed version's peer deps require a package version higher than what the project currently has, mark as Skipped (peer dep conflict: <details>) and do not attempt the upgrade.
3. For each remaining upgrade, determine if it's a direct dep (listed in package.json) or transitive dep (only in package-lock.json):
   - Direct deps: update the version in package.json
   - Transitive deps: run `npm update <pkg>` to update within semver range
   - Never add new `overrides` / `resolutions` entries or widen a parent's declared range to force a resolution — that risks breaking a parent which never declared support for the new version. (The existing `overrides` and `resolutions` in package.json predate this rule; leave them as they are.)
   - When an install can't reach its target, find the parent blocking it (`npm ls <pkg>`, then `npm info <parent>@<version> dependencies`). If that parent is a **direct** dep we declare, bumping _it_ is an ordinary upgrade rather than an override — try that, even across a major, and let Step 3 validate. Nothing else will surface it: a security ticket names the vulnerable package, never the parent pinning it, and Dependabot may have no PR open for it. Mark Skipped only when the blocker is transitive, or when bumping it fails validation.
4. Run `npm install` to update package-lock.json. **Do NOT delete package-lock.json and regenerate from scratch** — this can change hoisted dependency resolution and break builds even when no versions changed.
5. Diff package.json and package-lock.json against main to classify each Dependabot PR **and each Semgrep ticket** as:
   - Upgraded: version changed
   - No-op: version was already current or newer
   - Skipped: peer dep conflict, blocked by a transitive pin, or validation failure

   For tickets, see **Picking the target and matching results** under "Semgrep tickets" below — several tickets can share one install, and the match is per ticket.

6. Verify completeness: every PR and every ticket from step 1 must have a status (Upgraded, No-op, or Skipped). If any is unaccounted for, stop and report it before proceeding.
7. **Early exit**: if every PR and ticket is Skipped or No-op (zero upgrades applied), report the full table to the user with root cause explanations and stop — do not proceed to Step 3 or Step 4.

## Step 3: Validate

Run the full CI suite in order:

1. `npm run lint:ci` — ESLint, stylelint, and prettier checks
2. `npm run build` — Vite production build
3. `npm run build-ts` — TypeScript type check
4. `npm run test:ci` — Jest unit tests with coverage

If any step fails, **attempt to fix the breaking change with code modifications before rolling back**. Common patterns:

- **ESM-only packages**: Add transform entries and `transformIgnorePatterns` exclusions in `jest.config.js` so Jest can parse ESM imports.
- **Type compatibility** (e.g., a package tightening generics): Widen variable type annotations or add explicit casts.
- **Vite build errors**: Check for removed APIs or changed plugin interfaces in updated Vite / plugin packages.
- **React or Testing Library updates**: Update deprecated render patterns, matchers, or async utilities per the package's migration guide.
- **Prettier bumps**: a new Prettier release can reformat existing files and fail `format:check`. Run `npm run lint` (which applies `--fix`) and keep the cosmetic-only diff.

Only roll back and mark as Skipped if:

- The fix requires a large-scale migration across many files
- The upgrade is blocked by an external peer dependency constraint you cannot update

If a failure persists after investigation and you cannot identify a fix, roll back the upgrade and mark it as Skipped. Re-run validation until green.

## Step 4: Generate Outputs

Do NOT commit or create a PR. Instead, generate the following outputs for the human to use.

**Formatting for every generated markdown file:** one line per paragraph and one line per list item — never hard-wrap prose mid-sentence. Editors soft-wrap it anyway, and mid-paragraph breaks make later diffs noisy. Blank line between blocks, no trailing whitespace.

1. **Code changes explanation** — write a markdown file (`.claude/skills/batch-deps-upgrade/code-changes.md`) documenting every non-package.json source code change, explaining what broke, why, and the minimal fix applied.

2. **Commit message** — output a concise commit message the human can copy-paste into `git commit -m "..."`. Format: `chore(deps): quarterly batch dependency upgrade YYYY-QN` followed by a brief summary of upgrades, skips, and no-ops.

3. **PR description** — write a markdown file (`.claude/skills/batch-deps-upgrade/pr-description.md`) following the repo's PR template (.github/pull_request_template.md):
   - **High Level Overview**: bullet list of what changed (packages upgraded, skipped, no-op), with counts for both Dependabot PRs and Semgrep tickets. Call out separately, in the overview, any **major** bump taken to unblock a ticket: no PR or ticket asked for it, so a reviewer will not be expecting it and must see it flagged rather than buried in a table.
   - **Context of Change**: explain this is a quarterly batch of Dependabot PRs plus the Semgrep tickets a package upgrade can fix
   - **Type of Change**: check "Refactor" for minor/patch-only upgrades; check "Breaking change" if any production dependency has a major version bump
   - **Codebase Modernization**: mark N/A (no file conversions)
   - **Before / After**: technical description of changes; include any source code fixes with before/after snippets
   - **Test Plan**: note that the full CI suite (`lint:ci`, `build`, `build-ts`, `test:ci`) passed locally
   - Include a "Superseded Dependabot PRs" section with a table: PR (linked), Package, From, Asked for, Resolved, Status, MajorVersionUpgrade. The **Semgrep tickets** table uses these same columns, with the first headed `Ticket` — one shape for both artifacts.
     - `From` is the version on `main`; `Asked for` is what the PR proposed or the ticket requires (`≥ x.y.z`); `Resolved` is what the lockfile actually holds after the batch. Keep them in separate columns: the three routinely differ (a PR proposing 22.7.8 can resolve to 23.2.0), and burying the real version in Status prose makes the table unverifiable.
     - Status values: Upgraded, No-op (reason), Skipped (peer dep conflict / CI failure: error) — a status and its reason, never a version number.
     - MajorVersionUpgrade: `No` if the major version number did not change. Otherwise `Yes` plus a link for each major version crossed. For example, 7.x → 9.x yields `Yes ([v8](url), [v9](url))`. Each link should point to the package's release notes or changelog for that major version. Verify each link returns HTTP 200 and has meaningful content (e.g., `curl -sL -o /dev/null -w "%{http_code}" <url>`); if a package doesn't publish per-version GitHub releases, fall back to the CHANGELOG.md file or the closest valid release tag.
     - If there are no open Dependabot PRs, keep the section and say so in one line instead of an empty table.
   - Include a **"Semgrep tickets"** table with the same columns, the first headed `Ticket`. Status alone cannot be verified against `main`, so `Asked for` and `Resolved` must be their own columns. Because `close-list.md` is not committed, this table is the closing run's fallback. List the out-of-scope tickets (code findings, config findings) in one line above the table so a reader can see they were considered. Tickets with no fix version in their description are not out of scope — they get rows like any other.
   - Give ticket-driven upgrades that no Dependabot PR proposed their own table naming the motivating ticket — they are additions, not supersessions.
   - Closing instructions with two paragraphs:
     1. "After merging, run `/batch-deps-upgrade close` to close the superseded PRs and the resolved Semgrep tickets." Follow it with the list of Upgraded and No-op PRs (#X, #Y, #Z) and tickets (DGE-X, DGE-Y) as a record, so the PR documents what will be closed even if the skill isn't used.
     2. "The following PRs were Skipped and should remain open: #A (package-a), #B (package-b), ..." — annotate each with the package name. These stay open so Dependabot keeps rebasing them. List the Skipped tickets the same way, with the reason each stays open.

4. **Close list** — write a markdown file (`.claude/skills/batch-deps-upgrade/close-list.md`) recording every ticket and Dependabot PR the batch makes closable. This is the input to the closing run.
   1. **Close** — every Upgraded and No-op ticket and PR, in one shape for both so a single parser handles them:

      ```
      <ticket-key or #pr> | <package> | installed <resolved> (<asked for>) | Comment: "<text>"
      ```

      The third field must carry the **resolved** version, not the proposed one — that is what step 1 of the closing run checks against `main`, and a proposed version cannot be verified.

      For a ticket closed because its vulnerable version is no longer installed, put every installed version (or `none`) in the third field and the advisory's affected range in the parentheses, so the closing run can re-check it: `installed 0.7.2, 1.1.1 (affected < 0.7.0)`.

      Every comment must reference the batch PR, which does not exist yet at this point. Write that reference as the literal token `<PR>`; the closing run substitutes the merged PR's URL. Use a URL rather than `#1234`, which JIRA renders as plain text.

   2. **Left open** — every Skipped one, with its reason. Each is a security fix that did not land, so this is worth reading. Skipped PRs stay open for Dependabot to keep rebasing.

   **Do NOT commit `close-list.md`** — local scratch, like `code-changes.md` and `pr-description.md` (all three are listed in `.gitignore`). That is why the PR body must carry the same lists (item 3): it is the closing run's fallback when this file is gone.

## Semgrep tickets

Treat each in-scope ticket as one more row in Step 1's table: a package plus a target version, carried through Steps 1-4 and classified Upgraded / No-op / Skipped like any Dependabot PR. Only the differences are below.

### Where the list comes from (Step 1)

Fetch open tickets via the Atlassian MCP (cloud `ripplelabs.atlassian.net`):

```
parent = DGE-3869 AND project = DGE
AND status IN ("To Do", "in review", Blocked, "In Progress")
AND created >= "2022-01-01"
AND textfields ~ "explorer"
ORDER BY rank
```

The text match also returns tickets for other repos whose names contain "explorer" (e.g. `ripple/explorer-deploy`) — drop any whose summary names a repo other than `ripple/explorer`. The oldest tickets (DGE-39xx, summary "… in explorer") come from a GitLab mirror scan and do belong to this repo.

The full result is large; request only `summary`, `status`, `priority` and `description` and page with `nextPageToken` until `hasNextPage` is false.

**Take the package name from the summary, not the description** — a description may list several packages sharing one advisory, so it picks the wrong one. Take the fix version (`Recommended fix version:`), severity and CVE/GHSA link from the description. Wording varies, so read for intent rather than matching labels literally.

**A missing fix version does not put a ticket out of scope.** Older tickets (e.g. the DGE-39xx GitLab-mirror scans) give only `Current version` and a GHSA link. Look the advisory up with `gh api /advisories/<GHSA-id>` and read, for the ticket's package, each `vulnerable_version_range` and its `first_patched_version`. That gives the ticket a target, and it also gives the affected range used in **Picking the target and matching results** below. Dropping these tickets leaves them open forever: they never reach the Semgrep table or `close-list.md`, so the closing run never touches them and they come back every quarter.

Keep every ticket that names a package; drop only code findings (such as XSS/CSRF) and config findings (such as `.npmrc` / `dependabot.yml`). If tickets came back but none of them could be parsed, that is a parsing failure — stop. If the query returned nothing, or nothing was in scope, there is simply no Semgrep work this quarter: record zero and carry on with the Dependabot batch. A ticket becomes a row whether or not a Dependabot PR proposes that package; a ticket is reason enough on its own.

### Picking the target and matching results (Step 2)

Where a ticket and a PR both want the same install, the target is the **highest** version either wants. Three matching rules — get them wrong and you close tickets whose vulnerability is still installed:

- Compare with semver, never as strings — lexically `"7.5.9" > "7.5.21"`.
- Check the install the ticket means. One package can resolve at several versions at once (`brace-expansion`), so "any install ≥ target" can answer yes off an unrelated major line. Match the install on the ticket's own major line (the ticket's `Current version`). If that line is gone because the package moved to a **higher** major, the ticket is satisfied — the vulnerable line is no longer installed — provided the advisory's affected range does not extend into the new major.
- Match per ticket, not per package. Tickets sharing one install can want different versions (`postcss`, `js-yaml`). Never conclude "we upgraded X, so close the X tickets".

**Vulnerable version no longer installed.** A ticket whose vulnerable version has left the lockfile — because some earlier upgrade moved it past the fix, or its parent stopped depending on it — is **No-op** (`vulnerable version no longer installed`) and gets closed like any other No-op. Decide it from the advisory's affected ranges, not from the ticket's `Current version`: the ticket is satisfied only when **no** installed copy of the package, at any path in the lockfile, falls inside any affected range (compare with `semver.satisfies`, after turning the advisory's `>= a, < b` into `>=a <b`). A package absent from the lockfile altogether is satisfied. If an install still falls inside a range, the ticket is Upgraded or Skipped by the normal rules; when the advisory's `first_patched_version` is null there is no fix to upgrade to, so it is Skipped (`no patched version published`).

Classify from the Step 2.5 diff, not from which PR did what: a parent bump carries along a dependency it pins exactly, so a ticket can come out Upgraded with no PR naming its package.

Write `close-list.md` — the closing run's input, so keep it parseable, one item per line.

### Non-goal

Never remove a dependency to resolve a finding. A transitive dep leaves only when its parent stops depending on it; a direct dep with no published fix needs whatever imported it rewritten, which belongs in a human-authored PR.

## Closing run (`/batch-deps-upgrade close`)

> **Runs only when `ARGUMENTS` is `close`.** If you reached this section by reading past Step 4 during a default run, stop here — everything below comments on and closes real JIRA tickets and real public PRs.

Runs none of Steps 1-4: no ticket discovery, no bumps, and none of Step 3's build/test chain. That exclusion does **not** cover the per-item check in step 1 below — that one always runs, and it is the safeguard against closing something whose fix was reverted. Read section 1 of `close-list.md`; if it is missing, fall back to the merged PR body's lists. Identify the batch PR from an argument or `gh pr list --repo ripple/explorer --state merged --head <branch>`, and replace the `<PR>` token in every comment with its URL. **Check that no comment still contains `<PR>` before posting anything** — if one does, the substitution failed, so stop rather than post a placeholder onto dozens of tickets.

1. **Verify each item against the current `main`** (`git fetch origin main`, then read `package-lock.json` at `origin/main`) and skip anything not genuinely satisfied — a reviewer may have had an upgrade reverted. For items recorded with an affected range (`(affected …)`), check that no installed copy of the package on `main` falls inside it. This is what makes the run safe whether or not the batch has merged.
2. **Close everything that verified.** Do not ask for approval; the engineer reviewed both lists on the PR, and step 1 is the real check.
   - **JIRA tickets** — complete the `Done` transition first (query available transitions, take the one to `Done`), then post the comment. This avoids open-but-commented tickets if transition fails.
   - **Dependabot PRs** — `gh pr close <n> --repo ripple/explorer --comment "<comment>"`.
3. Report in this shape:

   ```
   Closed <n> JIRA tickets, <n> Dependabot PRs.

   Skipped — not satisfied on main @ <sha> (<n>):
     <TICKET-KEY>   <pkg> needs <version>, main has <version>
     #<pr-number>   <pkg> <version> never applied (<reason from close-list>)
   ```

   If nothing was skipped, say so rather than omitting the section.
