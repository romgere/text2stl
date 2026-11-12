# text2stl

Generate STL with text easily !

Inspired from : https://github.com/mo22/textstl

## TODO : 

- [ ] get rid of "counter" service (api no longer available ?)
- [ ] finalize tests (font-picker, theme switcher...)
- [ ] UI state as QP (open/close panel)
- [ ] See some improvements asked in GH issues

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (v22, see `.node-version`)
* [Yarn](https://classic.yarnpkg.com/) v1 (`yarn@1.22.22`, see `packageManager` in `package.json`)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Google Chrome](https://google.com/chrome/)

### Google font api key

To be able to run the app, you'll need to generate a [Google Fonts API key](https://developers.google.com/fonts/docs/developer_api#APIKey).

Then set the key as environment variable before running the `yarn start` command :
* `export GOOGLE_FONT_API_KEY="your-key-here"`


## Installation

* `git clone <repository-url>` this repository
* `cd text2stl`
* `yarn install`

## Contribute

To write...

## Running / Development

* `yarn start`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

**Update Percy snaphost**

Run `yarn percy exec:start`, then run `ember test` or `ember test --server` & visit http://127.0.0.1:4200/tests?filter=Acceptance%20%7C%20visual.

Note: You'll need `PERCY_TOKEN` variable defined in your env.

### Linting

* `yarn lint`
* `yarn lint:fix`

### Building

* `yarn workspace legacy ember build` (development, output in `packages/legacy/dist/`)
* `yarn build` (production, output in `dist/`)


## Usefull links

* [three.js](https://threejs.org/)
* [ember.js](https://emberjs.com/)
* [ember-cli](https://cli.emberjs.com/release/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
