import Component from '@glimmer/component'
import { inject as service } from '@ember/service'
import config from 'text2stl/config/environment'
const {
  APP: { availableLanguages }
} = config

interface LangSwitcherArgs {}

import IntlService from 'ember-intl/services/intl'
import { Registry as Services } from '@ember/service'

export default class LangSwitcher extends Component<LangSwitcherArgs> {

  @service declare intl: IntlService
  @service declare router:  Services['router']

  availableLanguages = availableLanguages
}
