import Component from '@glimmer/component'
import { inject as service } from '@ember/service'
import { action } from '@ember/object'
import config from 'text2stl/config/environment'
const {
  APP: { availableLanguages }
} = config

interface LangSwitcherArgs {}

import IntlService from 'ember-intl/services/intl'

export default class LangSwitcher extends Component<LangSwitcherArgs> {

  @service declare intl: IntlService

  availableLanguages = availableLanguages

  @action
  setLocale(locale: string) {
    this.intl.locale = locale === 'en-us' ? locale : [locale, 'en-us']
  }
}
