import Component from '@glimmer/component'
import { action } from '@ember/object'

interface UiInputArgs {
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default class UiInput extends Component<UiInputArgs> {
  get type() {
    return this.args?.type ?? 'text'
  }

  @action
  onInput({ target } :{target: HTMLInputElement}) {
    this.args.onChange(target.value)
  }
}
