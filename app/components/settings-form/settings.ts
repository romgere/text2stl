import Component from '@glimmer/component'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'
import { ModelType } from 'text2stl/services/text-maker'

interface SettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class SettingsFormTextSettings extends Component<SettingsFormTextSettingsArgs> {

  get showSupportSettings() {
    return this.args.model.type !== ModelType.TextOnly
  }

  @action
  setInt(props: 'size' | 'height' | 'spacing', value: string) {
    let v = parseInt(value, 10)
    this.args.model[props] = isNaN(v) ? undefined : v
  }
}
