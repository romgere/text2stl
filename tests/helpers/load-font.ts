import fonts from 'text2stl/tests/fixtures/fonts';
import * as opentype from 'opentype.js';

export default async function (name: string): Promise<opentype.Font> {
  const res = await fetch(fonts[name]);
  const fontData = await res.arrayBuffer();

  return opentype.parse(fontData);
}
