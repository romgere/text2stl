/**
 * This script is used to generate reference mesh used in unit test for text-maker service
 * see test/fixtures/meshs/snapshots/* & test/fixtures/meshs/test.js
 */

// "Mock/Hack" some imports
import './_require'

const { default: meshTests } = require('../meshs/tests')
const { default: TextMaker } = require('../../../app/services/text-maker')

const fs = require('fs')
const opentype = require('opentype.js')

const textMakerService = new TextMaker()

async function generateReferenceMeshSnaphots(name: string) : Promise<void> {
  let meshSettings = meshTests[name]

  // Load font
  let fontData = fs.readFileSync(`${__dirname}/../fonts/${meshSettings.font}.ttf`, null).buffer

  // Generate Mesh
  let mesh = textMakerService.generateMesh({
    ...meshSettings,
    font: opentype.parse(fontData)
  })

  // Save to reference file
  fs.writeFileSync(`${__dirname}/../meshs/snapshots/${name}.ts`, `/* eslint-disable */
    export default ${JSON.stringify(mesh.toJSON())}
  `)
}

// TODO: add option to script (single snapshot update)
for (let name in meshTests) {
  generateReferenceMeshSnaphots(name)
}
