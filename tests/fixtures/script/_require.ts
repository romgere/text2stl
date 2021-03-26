
const env = require('../../../config/environment')
const Module = require('module')
const originalRequire = Module.prototype.require

const mockedImports = {
  '@ember/service': class {},
  'text2stl/config/environment': env('test')
} as Record<string, any>

Module.prototype.require = function() {
  let [moduleName] = arguments

  if (mockedImports[moduleName]) {
    return mockedImports[moduleName]
  }

  return originalRequire.apply(this, arguments)
}
