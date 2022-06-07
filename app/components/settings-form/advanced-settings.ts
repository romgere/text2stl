import Component from '@glimmer/component'
import type TextMakerSettings from 'text2stl/models/text-maker-settings'
import { action } from '@ember/object'
import { ModelType } from 'text2stl/services/text-maker'

interface AdvancedSettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class AdvancedSettingsFormTextSettings extends Component<AdvancedSettingsFormTextSettingsArgs> {

  directions = ['top', 'bottom', 'right', 'left']
  handleTypes = ['none', 'hole', 'handle']

  get showSupportSettings() {
    return this.args.model.type !== ModelType.TextOnly
  }

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
    if (value === 'hole') {
      this.args.model.handleSettings.position = 'top'
      this.args.model.handleSettings.offsetX = 0
      this.args.model.handleSettings.offsetY = -10
      this.args.model.handleSettings.size = 5
    } else if (value === 'handle') {
      this.args.model.handleSettings.position = 'top'
      this.args.model.handleSettings.offsetX = 0
      this.args.model.handleSettings.offsetY = 0
      this.args.model.handleSettings.size = 5
      this.args.model.handleSettings.size2 = 2
    }
  }

  @action
  updateHandlePosition(value: 'top' | 'bottom' | 'right' | 'left') {
    this.args.model.handleSettings.position = value
    if (this.args.model.handleSettings.type === 'handle')  {
      this.args.model.handleSettings.offsetX = 0
      this.args.model.handleSettings.offsetY = 0
    } else {

      switch (value) {
        case 'top' :
          this.args.model.handleSettings.offsetX = 0
          this.args.model.handleSettings.offsetY = -10
          break
        case 'bottom' :
          this.args.model.handleSettings.offsetX = 0
          this.args.model.handleSettings.offsetY = 10
          break
        case 'right' :
          this.args.model.handleSettings.offsetX = -10
          this.args.model.handleSettings.offsetY = 0
          break
        case 'left' :
          this.args.model.handleSettings.offsetX = 10
          this.args.model.handleSettings.offsetY = 0
          break
      }
    }
  }

  @action
  setHandleSettingsInt(props: 'size' | 'size2' | 'offsetX' | 'offsetY', value: string) {
    let v = parseInt(value, 10)
    this.args.model.handleSettings[props] = isNaN(v) ? 0 : v
  }
}
