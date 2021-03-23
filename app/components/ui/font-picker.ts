import Component from '@glimmer/component'
import FontPicker from 'font-picker'
import { Font, Category } from '@samuelmeuli/font-manager'
import { action } from '@ember/object'
import { guidFor } from '@ember/object/internals'
import { tracked } from '@glimmer/tracking'
import config from 'text2stl/config/environment'
const {
  APP: { googleFontApiKey }
} = config

const availableFontCategories: Category[] = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace']

interface UiFontPickerArgs {
  sort?: 'alphabet' | 'popularity';
  value: string;
  onChange: (value: string) => void;
}

export default class UiFontPicker extends Component<UiFontPickerArgs> {

  fontPickerID: string

  fontPicker?: FontPicker

  availableFontCategories = availableFontCategories

  @tracked
  fontCategory = availableFontCategories[0]

  constructor(owner: unknown, args: UiFontPickerArgs) {
    super(owner, args)
    this.fontPickerID = guidFor(this)
  }

  onChange(font: Font) {
    this.args.onChange(font.family)
  }

  @action
  initFontPicker() {

    // as FontPicker does not handle dynamic option changing,
    // deal with it & remove previous FontPicket instance from DOM
    let container = document.querySelector(`#font-picker-${this.fontPickerID}`)
    if (container) {
      container.innerHTML = ''
    }

    this.fontPicker = new FontPicker(
      googleFontApiKey,
      undefined,
      {
        categories: [this.fontCategory],
        pickerId: this.fontPickerID,
        sort: this.args.sort ?? 'alphabet',
        limit: Number.MAX_SAFE_INTEGER
      },
      (f) => this.onChange(f)
    )
  }

  @action
  updateSelected(_: HTMLDivElement, selected: string) {
    this.fontPicker?.setActiveFont(selected)
  }

  @action
  changeFontCategory(category: Category) {
    this.fontCategory = category
    this.initFontPicker()
  }
}
