import Component from '@glimmer/component'
import { guidFor } from '@ember/object/internals'
import { tracked } from '@glimmer/tracking'
import FontManagerService from 'text2stl/services/font-manager'
import { inject as service } from '@ember/service'
import { action } from '@ember/object'

import type { Script, Variant } from '@samuelmeuli/font-manager'
import type IntlService from 'ember-intl/services/intl'

interface UiFontPickerArgs {
  fontName: string;
  variantName: Variant;
  onFontSettingsChange: (name: string, variant: Variant) => void;
}

export default class UiFontPicker extends Component<UiFontPickerArgs> {

  @service declare fontManager: FontManagerService

  @service declare intl: IntlService

  fontPickerID: string

  @tracked fontCategory
  @tracked fontScript?: Script;
  @tracked sort: 'alphabet' | 'popularity' = 'alphabet';

  get fontVariants() {
    return this.fontManager.fontList.get(this.args.fontName)?.variants ?? []
  }

  constructor(owner: unknown, args: UiFontPickerArgs) {
    super(owner, args)
    this.fontPickerID = guidFor(this)
    this.fontCategory = this.fontManager.availableFontCategories[0]
  }

  @action
  onFontNameChange(fontName: string) {
    let font = this.fontManager.fontList.get(fontName)
    if (font) {
      this.args.onFontSettingsChange(fontName, font.variants[0])
    } else {
      alert(this.intl.t('errors.font_load_generic'))
    }
  }

  @action
  onVariantNameChange(variantName: Variant) {
    this.args.onFontSettingsChange(this.args.fontName, variantName)
  }

  @action
  onScriptChange(value?: Script) {
    this.fontScript = value
  }
}
