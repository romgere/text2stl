import Controller from '@ember/controller'
import { htmlSafe } from '@ember/template'

export default class AppController extends Controller {

  get authorLink() {
    return htmlSafe('<a href="https://github.com/romgere" target="_blank" rel="noopener noreferrer">Romgere</a>')
  }

  get emberLink() {
    return htmlSafe('<a href="https://emberjs.com/" target="_blank" rel="noopener noreferrer">Ember.js</a>')
  }

  get threeLink() {
    return htmlSafe('<a href="https://threejs.org/"  target="_blank" rel="noopener noreferrer">three.js</a>')
  }
}

declare module '@ember/controller' {
  interface Registry {
    'application': AppController;
  }
}
