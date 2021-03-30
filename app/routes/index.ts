import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import IntlService from 'ember-intl/services/intl'

export default class AppIndexRoute extends Route {

  @service declare intl: IntlService

  beforeModel() {
    this.transitionTo('app.generate', this.intl.locale[0])
  }
}
