# Developer manual

## Publish to npmjs.com

Run the command `npm run dist` in the `./src` folder.

## Publish to GitHub Packages

* Publish to npmjs.com
* CD into `./dist`
* Add `"publishConfig": { "registry": "https://npm.pkg.github.com/" }` to `package.json`
* Update the name to `"name": "@humppa123/resilience-typescript",` in `package.json`
* Execute `npm login --registry=https://npm.pkg.github.com/`
* Publish with `npm publish`
