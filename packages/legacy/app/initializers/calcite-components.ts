import { setAssetPath } from '@esri/calcite-components/dist/components';

import config from 'text2stl/config/environment';
const { rootURL } = config;

// rootURL is either absolute (production) or relative (dev, test, Cloudflare previews)
const calciteAssetPath = new URL(`${rootURL}assets/calcite/`, window.location.origin).href;

setAssetPath(calciteAssetPath);

export function initialize() {}

export default {
  initialize,
};
