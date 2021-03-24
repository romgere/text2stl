import Component from '@glimmer/component'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'

interface SettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class SettingsFormTextSettings extends Component<SettingsFormTextSettingsArgs> {

  @action
  setInt(props: 'size' | 'height' | 'spacing', value: string) {
    let v = parseInt(value, 10)
    this.args.model[props] = isNaN(v) ? undefined : v
  }
}
