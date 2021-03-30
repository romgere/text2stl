import Route from '@ember/routing/route'

export default class AppIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('app.generate')
  }
}
