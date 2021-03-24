import Component from '@glimmer/component'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'

interface FontFormTextSettingsArgs {
  model: TextMakerSettings;
  onFontChange: () => void
}

export default class FontFormTextSettings extends Component<FontFormTextSettingsArgs> {

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
