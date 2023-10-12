import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from 'text2stl/config/environment';
const {
  APP: { availableLanguages },
} = config;

import type { CalciteSegmentedControl } from '@esri/calcite-components/dist/components/calcite-segmented-control';

interface LangSwitcherArgs {}

import IntlService from 'ember-intl/services/intl';
import { Registry as Services } from '@ember/service';

export default class LangSwitcher extends Component<LangSwitcherArgs> {
  @service declare intl: IntlService;
  @service declare router: Services['router'];

  availableLanguages = availableLanguages;

  @action
  changeLanguage(e: CustomEvent) {
    const lang = (e.target as CalciteSegmentedControl).value;
    this.router.replaceWith(this.router.currentRouteName, lang, {
      queryParams: {
        // Keep model settings
        modelSettings: this.router.currentRoute.queryParams.modelSettings,
      },
    });
  }
}
