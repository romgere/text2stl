# text2stl

Generate STL with text easily !

Inspired from : https://github.com/mo22/textstl

## TODO : 

- [x] center 3D render
- [x] move mesh rendering in textMaker service
- [x] Add model size information
- [x] better UI
- [ ] QP to save current settings ?
- [x] better font management (limit list, allow filtering, live preview)
- [ ] add other type of shape (with support / negative text / badge)
- [ ] ref ?
- [ ] html loader
- [x] counter of STL generated ?
- [x] fr/en translation
- [x] Language switcher
- [ ] Add somes options
- [ ] multi-line text ?
- [ ] save/load text (via URL encoded / local storage ?)
- [ ] handle custom font
- [ ] improve test coverage & deploy
- [ ] Any way to handle emoji or special char like '★' ?

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
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

To fix the tests, new mesh snapshots has to be generated. To generate the new snapshot use the command : 

`yarn generate:snapshot`

Warning: Don't run this command to fix tests if no modifications was made on `text-maker` service (or `three` deps update) or if you don't know why you run it (generating new snapshots will generate new UUID for mesh & create new useless file diffs)

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)


## Usefull links

* [three.js](https://threejs.org/)
* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
