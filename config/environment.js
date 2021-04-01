'use strict'

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'text2stl',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },

      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    'ember-toggle': {
      includedThemes: ['default']
    },

    APP: {
      textMakerDefault: {
        fontName: 'Open Sans',
        variantName: 'normal',
        fontSize: '400',
        text: 'Bienvenue !',
        size: 45,
        height: 10,
        spacing: 2,
        type: 2,
        supportHeight: 5,
        supportPadding: 10
      },

      threePreviewSettings: {
        backgroundColor: 0xe1e8f5,
        groundColor: 0x999999,
        gridSize: 2000,
        gridDivisions: 100,
        gridColor1: 0x3187f0,
        gridColor2: 0xf1f1f1,
        meshParameters: {
          color: 0xfa7f01
        }
      },

      googleFontApiKey: process.env.GOOGLE_FONT_API_KEY,

      availableLanguages: ['en-us', 'fr-fr'],

      countApi: {
        namespace: 'text2stl',
        key: environment === 'development' || environment === 'test'
          ? 'test_stl'
          : process.env.COUNTAPI_API_KEY
      }
    }
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
    ENV.APP.autoboot = false
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV
}
