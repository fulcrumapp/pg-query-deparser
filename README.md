## pg-query-deparser

Format PostgreSQL queries from AST nodes.

### Licensing and attribution

The package is licensed under BSD-3-Clause; see `LICENSE`. The original
upstream manifest also declared BSD-3-Clause and identifies Zac McCormick as
the author. `THIRD_PARTY_NOTICES.md` documents the upstream attribution and
license metadata. The BSD-3-Clause grant covers the package, including
Fulcrum-owned changes.

### Modern AST compatibility

`Deparser.deparse` accepts both legacy and modern libpg_query shapes:

- string **or** numeric enums for set ops, sort direction/nulls, null tests, min/max ops, sublinks, and lock strength
- bare aliases (`{ aliasname }`) **or** wrapped aliases (`{ Alias: { aliasname } }`)
- bare set-op arms (`larg`/`rarg` as SelectStmt fields) **or** wrapped `{ SelectStmt: ... }` arms

Fixtures under `test/fixtures/modern-parse/` were captured from modern `pg-query-parser` `parse()` output.

### Test

```bash
yarn test
```

### CI and releases

Pull requests to `main`, merge queue entries, and changes to `main` run tests
and a clean distribution build on GitHub-hosted runners. The existing lint
command also runs, but is non-blocking until its ESLint configuration is fixed.

After main validation succeeds, a GitHub App commits the next version to
`package.json` and creates a matching stable SemVer tag. Do not edit the root
package version manually. Tag creation starts a separate workflow that rebuilds
and publishes the package to GitHub Packages and creates GitHub release notes;
this repository does not publish to npmjs.org.

Before enabling releases, ensure public-fork workflow approval remains enabled,
and verify the required CI checks, GitHub Packages access, public App secrets, and
the release App's branch and tag protection bypasses. Disable any old publisher
at cutover. The existing `v1.0.1` tag contains package version `1.0.0`; the version
calculator uses stable tag history rather than modifying that tag. If publishing
fails, rerun the publish workflow for the same tag; it checks the tag, release
commit, and package version before publishing. Changes to the workflow after a
tag was created do not change that tag's workflow code.
