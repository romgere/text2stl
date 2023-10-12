import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import FontManagerService from 'text2stl/services/font-manager';
import TextMakerService from 'text2stl/services/text-maker';
import STLExporterService from 'text2stl/services/stl-exporter';
import CounterService from 'text2stl/services/counter';
import { tracked } from '@glimmer/tracking';
import { trackedFunction } from 'ember-resources/util/function';
import { Registry as Services } from '@ember/service';

import type ApplicationRoute from 'text2stl/routes/app/generator';
import type IntlService from 'ember-intl/services/intl';

export default class GeneratorController extends Controller {
  queryParams = ['modelSettings'];

  // Serialize model settings as QP
  get modelSettings() {
    return this.model?.serialize() ?? '';
  }

  set modelSettings(_value: string) {
    // Nothing needed here, model is update :
    // By route according to QP when route is loaded
    // By components for later update
  }

  @service declare textMaker: TextMakerService;

  @service declare fontManager: FontManagerService;

  @service declare stlExporter: STLExporterService;

  @service declare intl: IntlService;

  @service('counter') declare counterService: CounterService;

  @service declare router: Services['router'];

  declare model: RouteModel<ApplicationRoute>;

  _gtag = gtag;

  get counter() {
    return this.counterService.counter;
  }

  font = trackedFunction(this, async () => {
    return this.model.customFont
      ? this.fontManager.loadCustomFont(this.model.customFont)
      : this.fontManager.fetchFont(this.model.fontName, this.model.variantName);
  });

  mesh = trackedFunction(this, () => {
    if (this.font.isResolved && this.font.value) {
      this._gtag('event', 'stl_generation', {
        event_category: 'stl', // eslint-disable-line camelcase
        value: this.model.type,
      });

      return this.textMaker.generateMesh(this.model, this.font.value);
    }

    return null;
  });

  get meshGenerating() {
    return this.mesh.isLoading;
  }

  get exportDisabled() {
    return !this.mesh.value;
  }

  @tracked isFontLoading = true;

  @action
  async exportSTL() {
    const { value: mesh } = await this.mesh;

    if (!mesh) {
      return;
    }

    this._gtag('event', 'stl_download', {
      event_category: 'stl', // eslint-disable-line camelcase
      value: this.model.type,
    });

    this.counterService.updateCounter();
    this.stlExporter.downloadMeshAsSTL(mesh);
  }

  @tracked saveModalVisible = false;

  get currentUrl() {
    return window.location.href;
  }

  @action
  showSaveModal() {
    this.saveModalVisible = true;
  }

  @action
  hideSaveModal() {
    this.saveModalVisible = false;
  }

  @tracked resetModalVisible = false;

  @action
  async resetModel() {
    // Reset "modelSettings"
    await this.router.transitionTo(this.router.currentRouteName, this.intl.locale[0], {
      queryParams: { modelSettings: '' },
    });

    // Force refreshing model
    await this.router.refresh('app');
    this.hideResetModal();
  }

  @action
  showResetModal() {
    this.resetModalVisible = true;
  }

  @action
  hideResetModal() {
    this.resetModalVisible = false;
  }
}

declare module '@ember/controller' {
  interface Registry {
    'app.generator': GeneratorController;
  }
}
