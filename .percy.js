module.exports = {
  version: 2,
  snapshot: {
    widths: [
      375,
      1280
    ],

    minHeight: 1024,
    percyCSS: '',
    disableShadowDOM: false
  },

  discovery: {
    allowedHostnames: [],
    disallowedHostnames: [],
    networkIdleTimeout: 100
  },

  upload: {
    files: '**/*.{png,jpg,jpeg}',
    ignore: '',
    stripExtensions: false
  }
}
