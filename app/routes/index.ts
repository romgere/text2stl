import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

export default class IndexRoute extends Route {
  @service declare intl: IntlService;

  async model() {
    this.transitionTo('app.index', this.intl.locale[0]);
  }
}
