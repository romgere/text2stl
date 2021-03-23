import { TextMakerParameters } from 'text2stl/services/text-maker'
import { tracked } from '@glimmer/tracking'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

import type { FontName } from 'text2stl/services/font-manager'

export default class TextMakerSettings implements TextMakerParameters {

  @tracked fontName: FontName
  @tracked font: opentype.Font
  @tracked text: string
  @tracked size?: number
  @tracked height?: number
  @tracked spacing?: number

  constructor(args: TextMakerParameters & { fontName: FontName }) {
    this.font = args.font
    this.fontName = args.fontName
    this.text = args.text ?? textMakerDefault.text
    this.size = args.size ?? textMakerDefault.size
    this.height = args.height ?? textMakerDefault.height
    this.spacing = args.spacing ?? textMakerDefault.spacing
  }
}
