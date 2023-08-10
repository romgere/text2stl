import Component from '@glimmer/component';
import { action } from '@ember/object';

interface UiSelectArgs {
  options: string[];
  value?: string;
  placeholder?: string;
  required?: true;
  onChange: (value: string) => void;
}

export default class UiSelect extends Component<UiSelectArgs> {
  @action
  onChange({ target: { value } }: { target: { value: string } }) {
    this.args.onChange(value);
  }
}
