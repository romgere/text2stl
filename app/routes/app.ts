import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import IntlService from 'ember-intl/services/intl'

import { Registry as Services } from '@ember/service'

import type RouterService from '@ember/routing/router-service'
type Transition = ReturnType<RouterService['transitionTo']>;

export default class AppRoute extends Route {

  @service declare intl: IntlService
  @service declare router:  Services['router']

  constructor() {
    super(...arguments)
    this.router.on('routeDidChange', (transition: Transition) => this.updateMeta(transition))
  }

  async model({ locale }: { locale: string }) {
    this.intl.locale = locale === 'en-us' ? locale : [locale, 'en-us']
  }

  updateMeta(transition: Transition) {

    let metaDescription = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (metaDescription) {
      metaDescription.content = this.intl.t('seo.description')
    }

    let { name: toRouteName } = transition.to
    let canonicalHref = this.router.urlFor(toRouteName, { locale: this.intl.primaryLocale })

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalHref)
    }
  }
}
