import Component from '@glimmer/component'
import { Category } from '@samuelmeuli/font-manager'
import { guidFor } from '@ember/object/internals'
import { tracked } from '@glimmer/tracking'
import FontManagerService from 'text2stl/services/font-manager'
import { inject as service } from '@ember/service'

const availableFontCategories: Category[] = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace']

interface UiFontPickerArgs {
  value: string;
}

export default class UiFontPicker extends Component<UiFontPickerArgs> {

  @service declare fontManager: FontManagerService

  fontPickerID: string

  availableFontCategories = availableFontCategories

  @tracked
  fontCategory = availableFontCategories[0]

  constructor(owner: unknown, args: UiFontPickerArgs) {
    super(owner, args)
    this.fontPickerID = guidFor(this)
  }
}
