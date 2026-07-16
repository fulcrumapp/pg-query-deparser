## pg-query-deparser

Format PostgreSQL queries from AST nodes.

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

### Publishing
Reach out to your local engineering manager for this step.

- `yarn clean && yarn build`
- Bump package.json version
- Merge to `main`
- Checkout `main`, `git pull`
- `git tag -a vx.x.x -m "x.x.x"` (use actual tag number of next release)
- `git push origin --tags`
- Create a release for the tag in github
- Move .npmrc off to fulcrum.npmrc and `npm login` (Credentials in 1password)
- `npm publish`
- Move fulcrum.npmrc back to .npmrc to reset back to your own configurations