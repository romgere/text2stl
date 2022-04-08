import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, triggerEvent, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

const validFile = new Blob(['foo', 'bar'], { type: 'my/mime_type' })
const invalidFile = new Blob(['foo', 'bar'], { type: 'another/mime_type' })

async function triggerDropForFile(target: string | Element, file: Blob) {
  await triggerEvent(target, 'drop', {
    dataTransfer: {
      types: ['Files'],
      files: [file]
    }
  })
}

module('Integration | Component | ui/file-upload', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('acceptedMimeTypes', ['toto', 'tata'])

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @dropZoneLabel="Drop here"
      @inputZoneLabel="or click here"
      data-test-main
    />`)

    let input = find('input[type=file]') as HTMLInputElement

    assert.dom('[data-test-drop-zone-label]').hasText('Drop here')
    assert
      .dom('[data-test-input-label]')
      .hasText('or click here')
      .hasAttribute('for', input.id)

    assert.dom(input).hasAttribute('accept', 'toto tata')

    assert.dom('[data-test-main]').doesNotHaveClass('uk-dragover')
    await triggerEvent('[data-test-main]', 'dragover')
    assert.dom('[data-test-main]').hasClass('uk-dragover')
    await triggerEvent('[data-test-main]', 'dragleave')
    assert.dom('[data-test-main]').doesNotHaveClass('uk-dragover')
  })

  test('it handles file change for valid or invalid file type', async function(assert) {
    this.set('acceptedMimeTypes', ['my/mime_type'])
    this.set('onFileChange', function(f: File) {
      assert.step(`onFileChange:${f.type}`)
    })

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @onFileChange={{this.onFileChange}}
    />`)

    let input = find('input[type=file]') as any

    input.mockedFiles = [validFile]
    await triggerEvent('input[type="file"]', 'change')
    assert.verifySteps(['onFileChange:my/mime_type'])

    input.mockedFiles = [invalidFile]
    await triggerEvent('input[type="file"]', 'change')
    assert.verifySteps([])
  })

  test('it handles file droping for valid or invalid file type', async function(assert) {
    this.set('acceptedMimeTypes', ['my/mime_type'])
    this.set('onFileChange', function(f: File) {
      assert.step(`onFileChange:${f.type}`)
    })

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @onFileChange={{this.onFileChange}}
      data-test-main
    />`)

    await triggerDropForFile('[data-test-main]', validFile)
    assert.verifySteps(['onFileChange:my/mime_type'])

    await triggerDropForFile('[data-test-main]', invalidFile)
    assert.verifySteps([])
  })
})
