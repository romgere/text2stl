import Component from '@glimmer/component'
import { action } from '@ember/object'
import { debounce } from '@ember/runloop'

interface UiTextAreaArgs {
  value: string;
  placeholder?: string;
  debounce?: number;
  onChange: (value: string) => void;
}

export default class UiTextArea extends Component<UiTextAreaArgs> {

  onChange(value: string) {
    this.args.onChange(value)
  }

  @action
  onInput({ target } :{target: HTMLInputElement}) {
    if (this.args.debounce) {
      debounce(this, this.onChange, target.value, this.args.debounce)
    } else {
      this.onChange(target.value)
    }
  }
}
