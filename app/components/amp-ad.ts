import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import config from 'text2stl/config/environment';

const { environment } = config;

interface AmpAdArgs {
  width: string;
  height: string;
}

export default class LangSwitcher extends Component<AmpAdArgs> {
  get mockAd() {
    return ['development', 'test'].includes(environment);
  }

  get mockStyle() {
    const { width, height } = this.args;
    return htmlSafe(`width: ${width}; height: ${height}; background: lightblue`);
  }
}
