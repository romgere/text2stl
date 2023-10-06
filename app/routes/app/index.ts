import Route from '@ember/routing/route';

export default class AppIndex extends Route {
  afterModel() {
    document.querySelector('#app-loader')?.remove();
  }
}
