import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import IntlService from 'ember-intl/services/intl'

export default class ApplicationRoute extends Route {

  @service declare intl: IntlService

  model({ lang }: {lang : string }) {
    this.intl.locale = lang === 'en-us' ? lang : [lang, 'en-us']
  }
}
