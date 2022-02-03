import Component from '@glimmer/component'
import { guidFor } from '@ember/object/internals'
import { action } from '@ember/object'

interface UiRadioGroupArgs {
  options: any[];
  checked: string
  radioName?: string;
  onChange: (value: string) => void;
}

export default class UiRadioGroup extends Component<UiRadioGroupArgs> {

  id = guidFor(this)

  get radioName() {
    return this.args.radioName ?? `radio-${this.id}`
  }

  @action
  onChange({ target } :{target: HTMLInputElement}) {
    this.args.onChange(target.value)
  }
}
