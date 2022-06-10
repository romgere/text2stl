import Component from '@glimmer/component'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import { ModelType } from 'text2stl/services/text-maker'

interface SettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class SettingsFormSettings extends Component<SettingsFormTextSettingsArgs> {

  get showAdvancedSettings() {
    return this.args.model.type !== ModelType.TextOnly
  }
}
