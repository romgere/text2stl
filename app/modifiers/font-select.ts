import Modifier, { ArgsFor } from 'ember-modifier';
import FontPicker from 'font-picker';
import config from 'text2stl/config/environment';

import type { Font, Category, Script } from '@samuelmeuli/font-manager';
import type Owner from '@ember/owner';

const {
  APP: { googleFontApiKey },
} = config;

type namedArgs = {
  fontPickerID: string;
  onChange: (value: string) => void;
  sort?: 'alphabet' | 'popularity';
  fontScript?: Script;
};

interface FontSelectModifierSignature {
  Args: {
    Positional: [string, Category];
    Named: namedArgs;
  };
}

export default class FontSelectModifier extends Modifier<FontSelectModifierSignature> {
  fontPicker?: FontPicker;

  value: string;
  fontCategory: Category;
  fontScript?: Script;
  sort?: 'alphabet' | 'popularity';

  constructor(owner: Owner, args: ArgsFor<FontSelectModifierSignature>) {
    super(owner, args);
    this.value = args.positional[0];
    this.fontCategory = args.positional[1];
    this.fontScript = args.named.fontScript;
    this.sort = args.named.sort;
  }

  needReload(fontCategory: Category, fontScript?: Script, sort?: 'alphabet' | 'popularity') {
    return (
      !this.fontPicker ||
      this.fontCategory !== fontCategory ||
      this.fontScript !== fontScript ||
      this.sort !== sort
    );
  }

  modify(
    element: HTMLDivElement,
    [value, fontCategory]: [string, Category],
    args: ArgsFor<FontSelectModifierSignature>['named'],
  ) {
    let needReload = this.needReload(fontCategory, args.fontScript, args.sort);

    if (needReload) {
      element.innerHTML = '';
      this.fontPicker = new FontPicker(
        googleFontApiKey,
        value,
        {
          categories: [fontCategory],
          pickerId: args.fontPickerID,
          scripts: args.fontScript ? [args.fontScript] : undefined,
          sort: args.sort ?? 'alphabet',
          limit: Number.MAX_SAFE_INTEGER,
        },
        (font: Font) => args.onChange(font.family),
      );
    }

    // "Simple update" (just change active font)
    if (this.fontPicker && this.fontPicker?.getActiveFont().family !== value) {
      this.fontPicker?.setActiveFont(value);
    }
  }
}
