# S-Forms publishing workflow documentation

S-Forms follows the [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) recommendations for new **releases**, and a SHA based ID for new **pre-releases**. The workflow is described below:


## Publish new release

New releases should be done **only** on the **master** branch. Use the `release:<patch | minor | major>` to publish a new release. The script will automatically bump the version, create a new git tag and publish the library to npm. Refer to [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) to determine which script to use.

**NOTE:** You must be logged on [npmjs.com](https://www.npmjs.com/) and added to the [@kbss-cvut/s-forms](https://www.npmjs.com/org/kbss-cvut) organization to be able to publish manually.

## Publish alpha and beta pre-release

Pre-releases are automatically managed and published with [Github Actions](https://github.com/features/actions). Check `./github/npm-publish-*.yml` for more details on the workflow.

### Beta release

Beta releases are automatically published when a **pull request** is **merged** on the **master** branch.

### Alpha release

Alpha releases are automatically published on every **push** that is **not** on the **master** branch.