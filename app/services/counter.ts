import Service from '@ember/service'
import { tracked } from '@glimmer/tracking'

import config from 'text2stl/config/environment'
const {
  APP: { countApi }
} = config

export default class CounterService extends Service {

  @tracked
  _counter?: number = undefined

  // For test purpose only
  _initPromise?: Promise<void>

  get counter(): number {
    if (this._counter === undefined) {
      // eslint-disable-next-line ember/no-side-effects
      this._initPromise = this.initCounter()
    }

    return this._counter ?? 0
  }

  // For easy mock
  fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    return fetch(input, init)
  }

  private async initCounter(): Promise<void> {
    let res = await this.fetch(`https://api.countapi.xyz/get/${countApi.namespace}/${countApi.key}`)
    let data = await res.json()
    this._counter = data.value
  }

  async updateCounter() {
    let res = await this.fetch(`https://api.countapi.xyz/hit/${countApi.namespace}/${countApi.key}`)
    let data = await res.json()
    this._counter = data.value
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'counter': CounterService;
  }
}
