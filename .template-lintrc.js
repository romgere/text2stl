'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': true,
  },
  overrides: [
    {
      files: ['tests/**'],
      rules: {
        // these aren't helpful for testing
        'no-bare-strings': false,
        'no-inline-styles': false,
        'no-html-comments': false,
      },
    },
  ],
};
