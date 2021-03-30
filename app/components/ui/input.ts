import Component from '@glimmer/component'
import { action } from '@ember/object'
import { debounce } from '@ember/runloop'

interface UiInputArgs {
  value: string;
  type?: string;
  placeholder?: string;
  debounce?: number;
  onChange: (value: string) => void;
}

export default class UiInput extends Component<UiInputArgs> {
  get type() {
    return this.args?.type ?? 'text'
  }

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
