import Component from '@glimmer/component'
import type TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'
import { ModelType } from 'text2stl/services/text-maker'

interface AdvancedSettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class AdvancedSettingsFormTextSettings extends Component<AdvancedSettingsFormTextSettingsArgs> {

  supportPaddingDirs = ['top', 'bottom', 'right', 'left']

  get showSupportSettings() {
    return this.args.model.type !== ModelType.TextOnly
  }

  @action
  setSupportPaddingInt(props: 'top' | 'bottom' | 'right' | 'left', value: string) {
    let v = parseInt(value, 10)
    this.args.model.supportPadding[props] = isNaN(v) ? 0 : v
  }
}
