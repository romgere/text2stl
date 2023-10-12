'use strict';

// eslint-ignore-newt-line @typescript-eslint/no-var-requires
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Funnel } = require('broccoli-funnel');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    inlineContent: {
      loader: 'app/loader.html',
    },

    autoImport: {
      exclude: ['jsdom-global'],
    },
  });

  // Import the calcite CSS into the app CSS
  app.import('node_modules/@esri/calcite-components/dist/calcite/calcite.css');

  // Funnel the calcite static assets into the build assets directory
  let calciteAssetsTree = new Funnel('./node_modules/@esri/calcite-components/dist', {
    srcDir: '/',
    include: ['calcite/assets/**'],
    destDir: '/assets',
  });

  return app.toTree([calciteAssetsTree]);
};
