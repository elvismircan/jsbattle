# Release procedure (Internal)

Follow those steps to release a new version of JsBattle

1. Make sure that all changes are merged to `master` branch and switch to `master`.

2. Add version number and release date to **Unreleased** changes in `/CHANGELOG.md` and `/packages/*/CHANGELOG.md` files.

3. Commit and push changes made in the changelog.

4. Test the project by `npm run-script all` to make sure that everything works correctly.

5. Increase the version by `lerna version x.y.z` (it will push changes to git)

5. Create release in **GitHub**. Tag and Release Title should have format of "v1.0.0"

6. Rebuild the project to make sure that the build artifacts have new version number built-in.

7. Publish new version to NPM by `lerna publish from-package`.
