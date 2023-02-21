import Service from '@ember/service'
import * as opentype from 'opentype.js'
import config from 'text2stl/config/environment'
import { FontManager, OPTIONS_DEFAULTS, FONT_FAMILY_DEFAULT } from '@samuelmeuli/font-manager'
import type { Category, FontList, Variant } from '@samuelmeuli/font-manager'

const {
  APP: { googleFontApiKey }
} = config

export default class FontManagerService extends Service {

  availableFontCategories: Category[] = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace']
  fontList: FontList = new Map();

  fontCache: Record<string, opentype.Font> = {}

  opentype = opentype // For easy mock

  // For easy mock
  fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    return fetch(input, init)
  }

  async loadFontList() {
    for (let category of this.availableFontCategories) {

      let fontManager = new FontManager(googleFontApiKey, FONT_FAMILY_DEFAULT, {
        ...OPTIONS_DEFAULTS,
        categories: [category],
        sort: 'alphabet',
        limit: Number.MAX_SAFE_INTEGER,
        filter: (font) => Boolean(font?.files)
      })

      this.fontList = new Map([
        ...this.fontList,
        // eslint-disable-next-line no-await-in-loop
        ...await fontManager.init()
      ])
    }
  }

  async fetchFont(fontName: string, variantName?: Variant) : Promise<opentype.Font> {
    let font = this.fontList.get(fontName)
    if (!font) {
      throw `Unknown font name ${fontName}`
    }

    let { variants } = font
    let variant = variantName && variants.indexOf(variantName) >= 0 ? variantName : variants[0]

    let url = font.files?.[variant]
    if (!url) {
      url = font.files?.[Object.keys(font.files)[0] as Variant]
    }

    if (!url) {
      throw `Unable to find font url for ${fontName} / ${variantName}`
    }

    url = url.replace('http:', ':').replace('https:', ':')

    let cacheName = `${fontName}-${variantName}`
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
