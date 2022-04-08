import Service from '@ember/service'
import * as opentype from 'opentype.js'

import fonts from 'google-fonts-complete'
export type FontName = keyof typeof fonts

export default class FontManagerService extends Service {

  fontCache: Record<string, opentype.Font> = {}

  opentype = opentype // For easy mock

  // For easy mock
  fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    return fetch(input, init)
  }

  get fontNames() {
    return Object.keys(fonts)
  }

  get fonts() {
    return fonts
  }

  async fetchFont(fontName: FontName, variantName?: string, fontSize?: string) : Promise<opentype.Font> {
    let { variants } = this.fonts[fontName]
    let variant = variantName
      ? variants[variantName] ?? variants[Object.keys(variants)[0]]
      : variants[Object.keys(variants)[0]]
    let face = fontSize
      ? variant[fontSize] ?? variant[Object.keys(variant)[0]]
      : variant[Object.keys(variant)[0]]

    let url = face.url.ttf!.replace('http:', ':')

    let cacheName = `${fontName}-${variantName}-${fontSize}`
    if (!this.fontCache[cacheName]) {
      let res = await this.fetch(url)
      let fontData = await res.arrayBuffer()
      this.fontCache[cacheName] = this.opentype.parse(fontData)
    }

    return this.fontCache[cacheName]
  }

  async loadCustomFont(fontTTFFile: Blob): Promise<opentype.Font> {
    let fontAsBuffer = await fontTTFFile.arrayBuffer()
    return this.opentype.parse(fontAsBuffer)
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'font-manager': FontManagerService
  }
}
