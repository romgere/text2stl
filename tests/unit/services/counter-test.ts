import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | counter', function (hooks) {
  setupTest(hooks);

  test('it exists', async function (assert) {
    assert.expect(7);

    const fetchCall = assert.async(2);

    const service = this.owner.lookup('service:counter');

    let expectedUrl = '';
    let fetchReturn = {};

    service.fetch = function (url: string) {
      fetchCall();
      assert.strictEqual(url, expectedUrl, `fetch is done on ${url}`);
      return {
        json: async () => fetchReturn,
      };
    } as unknown as typeof fetch;

    expectedUrl = 'https://api.countapi.xyz/get/text2stl/test_stl';
    fetchReturn = { value: 123 };

    assert.strictEqual(service.counter, 0, 'first get for counter return 0');

    await service._initPromise;
    assert.strictEqual(service.counter, 123, 'counter is now conform to counterApi response');

    expectedUrl = 'https://api.countapi.xyz/hit/text2stl/test_stl';
    fetchReturn = { value: 1256 };
    await service.updateCounter();

    assert.strictEqual(service.counter, 1256, 'counter is conform to counterApi response');

    assert.ok(service);
  });
});
