import Component from '@glimmer/component'
import { ModelType } from 'text2stl/services/text-maker'

interface UiTypeSelectArgs {
  value: string;
  onChange: (value: string) => void;
}

export default class UiTypeSelect extends Component<UiTypeSelectArgs> {
  types = Object.keys(ModelType).filter((k) => !isNaN(Number(k))).map((k) => Number(k))

  get numberValue() {
    return Number(this.args.value)
  }
}
