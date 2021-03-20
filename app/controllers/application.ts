import Controller from '@ember/controller'
import { action } from '@ember/object'

export default class Application extends Controller {
  @action
  myAction() {
    alert('toto')
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'application': Application;
  }
}
