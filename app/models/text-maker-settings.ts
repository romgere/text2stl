import { TextMakerParameters, SupportPadding, ModelType, TextMakerAlignment } from 'text2stl/services/text-maker'
import { tracked } from '@glimmer/tracking'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

import type { FontName } from 'text2stl/services/font-manager'
interface TextMakerAdditionnalSettings {
  fontName: FontName
  variantName: string;
  fontSize: string;
}

export class SupportPaddingSettings implements SupportPadding {
  @tracked top: number
  @tracked bottom: number
  @tracked left: number
  @tracked right: number

  constructor(args: SupportPadding) {
    this.top = args.top
    this.bottom = args.bottom
    this.left = args.left
    this.right = args.right
  }
}

export default class TextMakerSettings implements TextMakerParameters {

  @tracked fontName: FontName
  @tracked variantName?: string
  @tracked fontSize?: string
  @tracked font: opentype.Font
  @tracked text: string
  @tracked size?: number
  @tracked customFont?: Blob
  @tracked height?: number
  @tracked spacing?: number
  @tracked vSpacing?: number
  @tracked alignment: TextMakerAlignment
  @tracked type: ModelType
  @tracked supportHeight?: number
  @tracked supportBorderRadius?: number
  @tracked supportPadding: SupportPaddingSettings

  constructor(args: TextMakerParameters & TextMakerAdditionnalSettings) {
    this.font = args.font
    this.variantName = args.variantName
    this.fontSize = args.fontSize
    this.fontName = args.fontName
    this.text = args.text ?? textMakerDefault.text
    this.size = args.size ?? textMakerDefault.size
    this.height = args.height ?? textMakerDefault.height
    this.spacing = args.spacing ?? textMakerDefault.spacing
    this.vSpacing = args.vSpacing ?? textMakerDefault.vSpacing
    this.alignment = args.alignment ?? textMakerDefault.alignment
    this.type = args.type ?? textMakerDefault.type
    this.supportHeight = args.supportHeight ?? textMakerDefault.supportHeight
    this.supportBorderRadius = args.supportBorderRadius ?? textMakerDefault.supportBorderRadius
    this.supportPadding = new SupportPaddingSettings(args.supportPadding ?? textMakerDefault.supportPadding)
  }
}
