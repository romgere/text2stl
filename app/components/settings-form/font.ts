import Component from '@glimmer/component'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'

interface FontFormTextSettingsArgs {
  model: TextMakerSettings;
  onFontChange: () => void
}

const acceptedMimeTypes = [
  'font/ttf',
  'font/woff',
  'font/otf',
  'application/vnd.oasis.opendocument.formula-template' // .otf file mimetype ??
]
export default class FontFormTextSettings extends Component<FontFormTextSettingsArgs> {

  @tracked
  useCustomFont = false

  customFont?: Blob

  acceptedMimeTypes = acceptedMimeTypes

  @action
  toggleCustomFont(useCustomFont: boolean) {
    this.useCustomFont = useCustomFont
    if (useCustomFont && this.customFont) {
      this.args.model.customFont = this.customFont
      this.args.onFontChange()
    } else if (!useCustomFont) {
      this.args.model.customFont = undefined
      this.args.onFontChange()
    }
  }

  @action
  setCustomFontFile(file: File) {
    this.customFont = file
    this.args.model.customFont = file
    this.args.onFontChange()
  }

  @action
  onFontNameChange(fontName: string) {
    this.args.model.fontName = fontName
    this.args.onFontChange()
  }

  @action
  onVariantNameChange(variantName: string) {
    this.args.model.variantName = variantName
    this.args.onFontChange()
  }

  @action
  onFontSizeChange(fontSize: string) {
    this.args.model.fontSize = fontSize
    this.args.onFontChange()
  }
}
