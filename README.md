[![Netlify Status](https://api.netlify.com/api/v1/badges/84ec36dc-4fef-4f8f-b482-b0b1d550baba/deploy-status)](https://app.netlify.com/sites/text2stl/deploys)


# text2stl

Generate STL with text easily !

Inspired from : https://github.com/mo22/textstl

## UI Refacto TODO : 

- theme switcher (+ dark Three theme ?)
- font form
- Fix language switcher
- Landing page
- fix header
- action bar tooltips 
- Reset button (& undo redo ?)
- French translation
- tests 
- UI state as QP (open/close panel)
- cherry pick three fixes (multiple instance)

## TODO : 

- [x] center 3D render
- [x] move mesh rendering in textMaker service
- [x] Add model size information
- [x] better UI
- [x] better font management (limit list, allow filtering, live preview)
- [x] add other type of shape (with support / negative text / badge)
- [x] html loader
- [x] counter of STL generated ?
- [x] fr/en translation
- [x] Language switcher
- [x] deploy
- [x] improve test coverage
- [ ] finalize font-picker tests
- [x] Add somes options (~~multiple kerning~~, multiple suport spacing, round corner, hole in support)
- [x] multi-line text ? (#33)
- [x] save/load text via  QP to save current settings
- [x] handle custom font

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Google Chrome](https://google.com/chrome/)

### Google font api key

To be able to run the app, you'll need to generate a [Google Fonts API key](https://developers.google.com/fonts/docs/developer_api#APIKey).

Then set the key as environment variable before running the `ember serve` command :
* `export GOOGLE_FONT_API_KEY="your-key-here"`


## Installation

* `git clone <repository-url>` this repository
* `cd text2stl`
* `npm install`

## Contribute

To write...

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

#### Mesh snapshots

The [text-maker](https://github.com/romgere/text2stl/blob/master/app/services/text-maker.ts) service's unit tests use mesh snapshot to test the service works as expected.

If the service is updated (aka. when the generated mesh changes) the test will break.

~~To fix the tests, new mesh snapshots has to be generated. To generate the new snapshot use the command :~~

~~`yarn generate:snapshot`~~

~~Warning: Don't run this command to fix tests if no modifications was made on `text-maker` service (or `three` deps update) or if you don't know why you run it (generating new snapshots will generate new UUID for mesh & create new useless file diffs)~~

**No longer work with node 14**

Mesh snapshot need to be manualy updated, see console, when some mesh tests are failing...

Easy way to re-generate snaptshot is to naviate to [127.0.0.1:4200/tests?filter=it generate mesh according to snapshots#download_fixture](127.0.0.1:4200/tests?filter=it generate mesh according to snapshots#download_fixture) & download all file in `tests/fixtures/meshs/`snapshots/

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)


## Usefull links

* [three.js](https://threejs.org/)
* [ember.js](https://emberjs.com/)
* [ember-cli](https://cli.emberjs.com/release/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
