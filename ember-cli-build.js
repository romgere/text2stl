'use strict';

// eslint-ignore-newt-line @typescript-eslint/no-var-requires
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    inlineContent: {
      loader: 'app/loader.html',
    },

    autoImport: {
      exclude: ['jsdom-global'],
    },
  });

  return app.toTree();
};
