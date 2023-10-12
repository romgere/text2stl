import { setAssetPath } from '@esri/calcite-components/dist/components';

import config from 'text2stl/config/environment';
const { rootURL, environment } = config;

setAssetPath(
  environment === 'development'
    ? `${window.location.origin}${rootURL}assets/calcite/`
    : `${rootURL}assets/calcite/`,
);

export function initialize(/* application */) {}

export default {
  initialize,
};
