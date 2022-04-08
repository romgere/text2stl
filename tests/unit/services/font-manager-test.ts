import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import * as opentype from 'opentype.js'
import fonts from 'google-fonts-complete'
import cases from 'qunit-parameterize'
import type FontManagerService from 'text2stl/services/font-manager'

module('Unit | Service | font-manager', function(hooks) {
  setupTest(hooks)

  cases([
    {
      fontName: 'Open Sans',
      variantName: undefined,
      fontSize: undefined,
      expectedFontUrl: fonts['Open Sans'].variants.italic['300'].url.ttf,
      title: 'Font name without variant & size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'normal',
      fontSize: undefined,
      expectedFontUrl: fonts['Open Sans'].variants.normal['300'].url.ttf,
      title: 'Font name with variant & whitout size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'unknown',
      fontSize: undefined,
      expectedFontUrl: fonts['Open Sans'].variants.italic['300'].url.ttf,
      title: 'Font name with unknow variant & whitout size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'normal',
      fontSize: '400',
      expectedFontUrl: fonts['Open Sans'].variants.normal['400'].url.ttf,
      title: 'Font name with variant & size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'normal',
      fontSize: '2307',
      expectedFontUrl: fonts['Open Sans'].variants.normal['300'].url.ttf,
      title: 'Font name with variant & unknow size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'unknown',
      fontSize: '2307',
      expectedFontUrl: fonts['Open Sans'].variants.italic['300'].url.ttf,
      title: 'Font name with unknow variant & unknow size'
    },
    {
      fontName: 'Open Sans',
      variantName: 'unknown',
      fontSize: '400',
      expectedFontUrl: fonts['Open Sans'].variants.italic['400'].url.ttf,
      title: 'Font name with unknow variant & known size'
    }
  ]).test('it fetch font', async function({ expectedFontUrl, fontName, variantName, fontSize }, assert) {

    let service = this.owner.lookup('service:font-manager') as FontManagerService

    service.fetch = async function(input: RequestInfo): Promise<Response> {
      assert.equal(input, expectedFontUrl, 'It fetch the correct font')
      return {
        arrayBuffer: () => 'fetched-array-buffer'
      } as unknown as Response
    }

    service.opentype = {
      parse(buffer: any): opentype.Font {
        assert.equal(buffer, 'fetched-array-buffer', 'font is parsed with fetch result')
        return 'parsed-font' as unknown as opentype.Font
      }
    } as typeof opentype

    let font = await service.fetchFont(fontName, variantName, fontSize)
    assert.equal(font, 'parsed-font', 'correct font is returned')
  })

  test('it cache font', async function(assert) {
    let fetchDone = assert.async()
    let parseDone = assert.async()

    let service = this.owner.lookup('service:font-manager') as FontManagerService

    service.fetch = async function(): Promise<Response> {
      fetchDone()
      return {
        arrayBuffer: () => {}
      } as Response
    }

    service.opentype = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      parse(_: any): opentype.Font {
        parseDone()
        return 'a-parsed-font' as unknown as opentype.Font
      }
    } as typeof opentype

    let font = await service.fetchFont('Open Sans')
    assert.equal(font, 'a-parsed-font', 'Font is returned')

    font = await service.fetchFont('Open Sans')
    assert.equal(font, 'a-parsed-font', 'Font is returned')
  })

  test('it can load custom font file', async function(assert) {
    let service = this.owner.lookup('service:font-manager') as FontManagerService

    let mockedBlob = {
      async arrayBuffer() {
        return 'a_great_boeuf-er'
      }
    }

    service.opentype = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      parse(buffer: any): opentype.Font {
        assert.equal(buffer, 'a_great_boeuf-er', 'blob buffer is passed to opentype.parse')
        return 'a-parsed-font' as unknown as opentype.Font
      }
    } as typeof opentype

    let font = await service.loadCustomFont(mockedBlob as unknown as Blob)
    assert.equal(font, 'a-parsed-font', 'Font is returned')
  })
})

