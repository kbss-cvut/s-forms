# SForms publishing workflow documentation

SForms follows the [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) recommendations for new **releases**, and a SHA based ID for new **pre-releases**. The workflow is described below.

## Publish new release

New releases are done **only** on the **master** branch. The recommended workflow to publish a new release is as follows:

1. Format your files with `npm run prettier:format`.
2. Commit all your files.
3. Use the `npm run release:<patch | minor | major>` to publish a new release. The script will automatically bump the version, create a new git tag, publish the library to npm and **push your commit**. Refer to [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) to determine which script to use.

**NOTE:** You must be logged on [npmjs.com](https://www.npmjs.com/) and added to the [@kbss-cvut/s-forms](https://www.npmjs.com/org/kbss-cvut) organization to be able to publish manually.

## Publish alpha and beta pre-release

Pre-releases are automatically managed and published with [Github Actions](https://github.com/features/actions). Check `./github/npm-publish-*.yml` or the [workflow directory](https://github.com/kbss-cvut/s-forms/actions) for more detail.

### Beta release

Beta releases are automatically published by [github workflow](https://github.com/kbss-cvut/s-forms/actions/workflows/npm-publish-beta.yml) when a **pull request** is **merged** on the **master** branch.

### Alpha release

Alpha releases are automatically published by [github workflow](https://github.com/kbss-cvut/s-forms/actions/workflows/npm-publish-alpha.yml) on every **push** that is **not** on the **master** branch.
