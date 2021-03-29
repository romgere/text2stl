
import fonts from 'text2stl/tests/fixtures/fonts'
import * as opentype from 'opentype.js'

export default async function(name: string): Promise<opentype.Font> {
  let res = await fetch(fonts[name])
  let fontData = await res.arrayBuffer()

  return opentype.parse(fontData)
}
