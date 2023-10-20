/* eslint-disable no-await-in-loop */
import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import testsSettings from './_tests-settings';
import percySnapshot from '@percy/ember';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import mockFontManager from 'text2stl/tests/helpers/mock-font-manager';
import mockGtag from 'text2stl/tests/helpers/mock-gtag';
import waitCalciteReady from 'text2stl/tests/helpers/wait-calcite-ready';

module('Acceptance | visual', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFontManager(this.owner);
    mockGtag(this.owner);
  });

  for (let testIdx = 0; testIdx < testsSettings.length; testIdx++) {
    test(`visual test #${testIdx + 1}`, async function (assert) {
      const settings = new TextMakerSettings(testsSettings[testIdx]);
      const settingsQP = settings.serialize();
      // Load test settings through QP
      await visit(`/en-us/generator?modelSettings=${settingsQP}`);
      await waitCalciteReady();

      await new Promise(function (resolve) {
        setTimeout(resolve, 250);
      });
      await percySnapshot(`visual test #${testIdx + 1}`);
      assert.true(true);
    });
  }
});
