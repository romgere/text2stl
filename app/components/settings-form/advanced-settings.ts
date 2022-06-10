import Component from '@glimmer/component'
import type TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

interface AdvancedSettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class AdvancedSettingsFormTextSettings extends Component<AdvancedSettingsFormTextSettingsArgs> {

  directions = ['top', 'bottom', 'right', 'left']
  handleTypes = ['none', 'hole', 'handle']

  get showHandleSettings() {
    return this.args.model.handleSettings.type !== 'none'
  }

  get showHandleSize2() {
    return this.args.model.handleSettings.type === 'handle'
  }

  @action
  setSupportPaddingInt(props: 'top' | 'bottom' | 'right' | 'left', value: string) {
    let v = parseInt(value, 10)
    this.args.model.supportPadding[props] = isNaN(v) ? 0 : v
  }

  @action
  setInt(props: 'supportBorderRadius', value: string) {
    let v = parseInt(value, 10)
    this.args.model[props] = isNaN(v) ? undefined : v
  }

  @action
  updateHandleType(value: 'none' | 'hole' | 'handle') {
    this.args.model.handleSettings.type = value
    // reset some handle settings to "default"
    this.args.model.handleSettings.position = textMakerDefault.handleSettings.position
    this.args.model.handleSettings.offsetX = textMakerDefault.handleSettings.offsetX
    this.args.model.handleSettings.offsetY = textMakerDefault.handleSettings.offsetY
    this.args.model.handleSettings.size = textMakerDefault.handleSettings.size
    this.args.model.handleSettings.size2 = textMakerDefault.handleSettings.size2
  }

  @action
  updateHandlePosition(value: 'top' | 'bottom' | 'right' | 'left') {
    this.args.model.handleSettings.position = value
    this.args.model.handleSettings.offsetX = textMakerDefault.handleSettings.offsetX
    this.args.model.handleSettings.offsetY = textMakerDefault.handleSettings.offsetY
  }

  @action
  setHandleSettingsInt(props: 'size' | 'size2' | 'offsetX' | 'offsetY', value: string) {
    let v = parseInt(value, 10)
    this.args.model.handleSettings[props] = isNaN(v) ? 0 : v
  }
}
