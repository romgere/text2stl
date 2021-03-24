import Component from '@glimmer/component'
import FontPicker from 'font-picker'
import { action } from '@ember/object'
import { Font, Category } from '@samuelmeuli/font-manager'

import config from 'text2stl/config/environment'
const {
  APP: { googleFontApiKey }
} = config

interface FontPickerSelectArgs {
  fontPickerID: string
  sort?: 'alphabet' | 'popularity';
  fontCategory: Category
  value: string;
  onChange: (value: string) => void;
}

export default class FontPickerSelect extends Component<FontPickerSelectArgs> {

  fontPicker?: FontPicker

  onChange(font: Font) {
    this.args.onChange(font.family)
  }

  @action
  initFontPicker() {

    // as FontPicker does not handle dynamic option changing,
    // deal with it & remove previous FontPicket instance from DOM
    let container = document.querySelector(`#font-picker-${this.args.fontPickerID}`)
    if (container) {
      container.innerHTML = ''
    }

    this.fontPicker = new FontPicker(
      googleFontApiKey,
      this.args.value,
      {
        categories: [this.args.fontCategory],
        pickerId: this.args.fontPickerID,
        sort: this.args.sort ?? 'alphabet',
        limit: Number.MAX_SAFE_INTEGER
      },
      (f) => this.onChange(f)
    )
  }

  @action
  updateSelected(_: HTMLDivElement, [selected]: [string]) {
    if (this.fontPicker?.getActiveFont().family !== selected) {
      this.fontPicker?.setActiveFont(selected)
    }
  }

  @action
  changeFontCategory() {
    this.initFontPicker()
  }
}
