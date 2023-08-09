import Component from '@glimmer/component';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import { ModelType } from 'text2stl/services/text-maker';
import { tracked } from '@glimmer/tracking';

interface SettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

type Tab = 'settings' | 'font' | 'advanced';

export default class SettingsFormSettings extends Component<SettingsFormTextSettingsArgs> {
  @tracked currentTab: Tab = 'settings';

  get activeTab() {
    return !this.showAdvancedSettings && this.currentTab === 'advanced'
      ? 'settings'
      : this.currentTab;
  }

  get tabs(): Tab[] {
    let tabs: Tab[] = ['settings', 'font'];

    return this.showAdvancedSettings ? [...tabs, 'advanced'] : tabs;
  }

  get showAdvancedSettings() {
    return this.args.model.type !== ModelType.TextOnly;
  }
}
