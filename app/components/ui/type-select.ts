import Component from '@glimmer/component'
import { ModelType } from 'text2stl/services/text-maker'

interface UiTypeSelectArgs {
  value: string;
  onChange: (value: string) => void;
}

export default class UiTypeSelect extends Component<UiTypeSelectArgs> {
  types = Object.keys(ModelType).filter((k) => !isNaN(Number(k))).map((k) => Number(k))

  // handle ember-cli finger printing
  typeImages = {
    1: '/img/type_1.png',
    2: '/img/type_2.png',
    3: '/img/type_3.png',
    4: '/img/type_4.png'
  }

  get numberValue() {
    return Number(this.args.value)
  }
}
