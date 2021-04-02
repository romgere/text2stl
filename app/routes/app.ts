import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import IntlService from 'ember-intl/services/intl'

export default class AppRoute extends Route {

  @service declare intl: IntlService

  async model({ locale }: { locale: string }) {
    this.intl.locale = locale === 'en-us' ? locale : [locale, 'en-us']
  }
}
