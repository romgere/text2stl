import Service, { inject as service } from '@ember/service';
import loadFont from 'text2stl/tests/helpers/load-font';

import type Owner from '@ember/owner';
import type HarfbuzzService from 'text2stl/services/harfbuzz';

class FakeFontManager extends Service {
  @service declare harfbuzz: HarfbuzzService;

  fontList = new Map();

  availableFontCategories = ['mock'];
  availableFontScript = ['mock'];

  async loadFont() {
    this.fontList.set('mock', { family: 'mock', category: 'mock', variants: ['regular'] });
  }

  async fetchFont(name: string) {
    const buffer = await loadFont(name);

    const blob = this.harfbuzz.hb.createBlob(buffer);
    const face = this.harfbuzz.hb.createFace(blob, 0);
    return {
      font: this.harfbuzz.hb.createFont(face),
      face,
    };
  }
}

export default function (owner: Owner) {
  owner.register('service:font-manager', FakeFontManager);
}
