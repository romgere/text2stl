import type Owner from '@ember/owner';

import Service from '@ember/service';
import loadFont from 'text2stl/tests/helpers/load-font';

export default function (owner: Owner) {
  owner.register(
    'service:font-manager',
    class extends Service {
      fontList = new Map();

      availableFontCategories = ['mock'];
      availableFontScript = ['mock'];

      constructor() {
        super();
        this.fontList.set('mock', { family: 'mock', category: 'mock', variants: ['regular'] });
      }
      async loadFont() {}

      async fetchFont(name: string) {
        return loadFont(name);
      }
    },
  );
}
