/**
 * This script is used to generate reference mesh used in unit test for text-maker service
 * see test/fixtures/meshs/snapshots/* & test/fixtures/meshs/test.js
 */

// "Mock/Hack" some imports
import './_require'

// init browser env (window is needed by @enable3d)
import 'jsdom-global/register'

const { default: meshTests } = require('../meshs/tests')
const { default: TextMaker } = require('../../../app/services/text-maker')

type MeshKey = keyof typeof meshTests

const fs = require('fs')
const opentype = require('opentype.js')

const textMakerService = new TextMaker()

async function generateReferenceMeshSnaphots(name: MeshKey) : Promise<void> {

  console.log(`Start generating "${String(name)}" snapshot...`)

  let meshSettings = meshTests[name]

  // Load font
  let fontData = fs.readFileSync(`${__dirname}/../fonts/${meshSettings.font}.ttf`, null).buffer

  // Generate Mesh
  let mesh = textMakerService.generateMesh({
    ...meshSettings,
    font: opentype.parse(fontData)
  })

  // Save to reference file
  fs.writeFileSync(`${__dirname}/../meshs/snapshots/${String(name)}.ts`, `export default ${JSON.stringify(mesh.toJSON())}`)

  console.log(`Snapshot "${String(name)}" generated.`)
}

let snapshotNames = Object.keys(meshTests) as MeshKey[]
let snapShotIndexImports = ''

for (let name of snapshotNames) {
  generateReferenceMeshSnaphots(name)
  snapShotIndexImports += `import ${String(name)} from './${String(name)}'\n`
}

let snapShotIndexFile = `${snapShotIndexImports}
export default {
  ${snapshotNames.join(', ')}
} as Record<string, Object & { geometries: Object}>\n`

fs.writeFileSync(`${__dirname}/../meshs/snapshots/index.ts`, snapShotIndexFile)

console.log('Index file generated.')

console.log('Done !')
