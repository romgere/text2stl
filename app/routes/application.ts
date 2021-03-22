import Route from '@ember/routing/route'
import fonts from 'google-fonts-complete'
import { hash } from 'rsvp'

export default class Application extends Route {
  model() {
    return hash({
      fonts,
      fontNames: Object.keys(fonts).slice(0, 30)
    })
  }
}
