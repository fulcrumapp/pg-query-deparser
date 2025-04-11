## pg-query-deparser

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