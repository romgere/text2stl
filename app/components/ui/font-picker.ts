import Component from '@glimmer/component'
import { Category } from '@samuelmeuli/font-manager'
import { guidFor } from '@ember/object/internals'
import { tracked } from '@glimmer/tracking'
import FontManagerService from 'text2stl/services/font-manager'
import { inject as service } from '@ember/service'
import { action } from '@ember/object'

const availableFontCategories: Category[] = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace']

interface UiFontPickerArgs {
  fontName: string;
  variantName: string;
  fontSize: string;
  onFontNameChange: (value: string) => void;
  onVariantNameChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
}

interface SizeName {
  name: string;
  label: string;
}

type SizeNames = SizeName[]

export default class UiFontPicker extends Component<UiFontPickerArgs> {

  @service declare fontManager: FontManagerService

  fontPickerID: string

  availableFontCategories = availableFontCategories

  @tracked
  fontCategory = availableFontCategories[0]

  get fontVariants() {
    return this.fontManager.fonts[this.args.fontName].variants
  }

  get fontVariantNames(): string[] {
    return Object.keys(this.fontVariants)
  }

  get fontSizes() : SizeNames {
    let sizes = this.fontVariants[this.args.variantName]
    let sizeNames: SizeNames = []
    for (let name in sizes) {
      let label = sizes[name].local[0]
      label = label.substring(1, label.length - 1)

      sizeNames.push({
        name,
        label
      })
    }

    return sizeNames
  }

  constructor(owner: unknown, args: UiFontPickerArgs) {
    super(owner, args)
    this.fontPickerID = guidFor(this)
  }

  @action
  onFontNameChange(fontName: string) {
    this.args.onFontNameChange(fontName)
    // Reset variant & size
    let variantName = Object.keys(this.fontManager.fonts[fontName].variants)[0]
    this.args.onVariantNameChange(variantName)
    this.args.onFontSizeChange(
      Object.keys(this.fontVariants[variantName])[0]
    )
  }

  @action
  onVariantNameChange(variantName: string) {
    this.args.onVariantNameChange(variantName)
    // Reset  size
    this.args.onFontSizeChange(
      Object.keys(this.fontVariants[variantName])[0]
    )
  }
}
