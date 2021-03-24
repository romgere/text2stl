import Service from '@ember/service'
import * as opentype from 'opentype.js'

import fonts from 'google-fonts-complete'
export type FontName = keyof typeof fonts

export default class FontManagerService extends Service {

  fontCache: Record<string, opentype.Font> = {}

  get fontNames() {
    return Object.keys(fonts)
  }

  get fonts() {
    return fonts
  }

  async fetchFont(fontName: FontName, variantName: string = 'normal', fontSize: string = '400') : Promise<opentype.Font> {
    let { variants } = this.fonts[fontName]
    let variant = variants[variantName] ?? variants[Object.keys(variants)[0]]
    let face = variant[fontSize] ?? variant[Object.keys(variant)[0]]

    let url = face.url.ttf!.replace('http:', ':')

    let cacheName = `${fontName}-${variantName}-${fontSize}`
    if (!this.fontCache[cacheName]) {
      let res = await fetch(url)
      let fontData = await res.arrayBuffer()
      this.fontCache[cacheName] = opentype.parse(fontData)
    }

    return this.fontCache[cacheName]
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'font-manager': FontManagerService
  }
}
