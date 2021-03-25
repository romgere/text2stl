import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import Service from '@ember/service'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import * as opentype from 'opentype.js'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

module('Unit | Route | application', function(hooks) {
  setupTest(hooks)

  test('it creates a model with default values & fetch default font', async function(assert) {

    assert.expect(6)

    let mockedFont = new opentype.Font({
      familyName: '1', styleName: 'fake font', unitsPerEm: 1, ascender: 1, descender: -1, glyphs: []
    })

    this.owner.register('service:font-manager', class extends Service {
      fonts = 'font_list'
      fontNames = 'font_names'
      async fetchFont(fontName: string, variantName: string, fontSize: string) {
        assert.equal(fontName, textMakerDefault.fontName, 'Font is fetch with default fontName')
        assert.equal(variantName, textMakerDefault.variantName, 'Font is fetch with default variantName')
        assert.equal(fontSize, textMakerDefault.fontSize, 'Font is fetch with default fontSize')
        return mockedFont
      }
    })

    let route = this.owner.lookup('route:application')

    let model = await route.model()
    assert.equal(model.fonts, 'font_list', 'rouet model have fonts')
    assert.equal(model.fontNames, 'font_names', 'rouet model have fontNames')

    assert.propEqual(
      model.settings,
      new TextMakerSettings({
        ...textMakerDefault,
        font: mockedFont
      }),
      'settings model is conform'
    )
  })
})
