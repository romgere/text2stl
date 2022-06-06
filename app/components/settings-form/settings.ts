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

  get enableMultiline() {
    return this.args.model.type !== ModelType.VerticalTextWithSupport
  }

  get textIsMultiLine() {
    return this.args.model.text.split('\n').length > 1
  }

  get supportPadding() {
    return `${this.args.model.supportPadding?.top ?? 0}`
  }

  set supportPadding(value: string) {
    let v = parseInt(value, 10)
    v = isNaN(v) ? 0 : Math.max(0, v)
    this.args.model.supportPadding.top = v
    this.args.model.supportPadding.bottom = v
    this.args.model.supportPadding.left = v
    this.args.model.supportPadding.right = v
  }

  alignmentOptions = ['left', 'center', 'right']

  @action
  setInt(props: 'size' | 'height' | 'spacing' | 'vSpacing', value: string) {
    let v = parseInt(value, 10)
    this.args.model[props] = isNaN(v) ? undefined : v
  }

  @action
  changeType(type: ModelType) {
    this.args.model.type = type
    if (!this.enableMultiline) {
      this.args.model.text = this.args.model.text.split('\n').join(' ')
    }
  }
}
