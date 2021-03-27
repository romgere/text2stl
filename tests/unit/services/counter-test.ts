import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | counter', function(hooks) {
  setupTest(hooks)

  test('it exists', async function(assert) {
    let fetchCall = assert.async(2)

    let service = this.owner.lookup('service:counter')

    let expectedUrl = ''
    let fetchReturn = {}

    service.fetch = function(url: string) {
      fetchCall()
      assert.equal(url, expectedUrl, `fetch is done on ${url}`)
      return {
        json: async() => fetchReturn
      }
    }

    expectedUrl = 'https://api.countapi.xyz/get/text2stl/test_stl'
    fetchReturn = { value: 123 }

    assert.equal(
      service.counter,
      0,
      'first get for counter return 0'
    )

    await service._initPromise
    assert.equal(
      service.counter,
      123,
      'counter is now conform to counterApi response'
    )

    expectedUrl = 'https://api.countapi.xyz/hit/text2stl/test_stl'
    fetchReturn = { value: 1256 }
    await service.updateCounter()

    assert.equal(
      service.counter,
      1256,
      'counter is conform to counterApi response'
    )

    assert.ok(service)
  })
})

