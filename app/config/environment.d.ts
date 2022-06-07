export default config
import { ModelType } from 'text2stl/services/text-maker'

/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: string;
  rootURL: string;
  APP: Record<string, unknown> & {
    textMakerDefault : {
      fontName: string;
      variantName: string;
      fontSize: string;
      text: string;
      size: number;
      height: number;
      spacing: number;
      vSpacing: number;
      alignment: 'left' | 'center' | 'right'
      type: ModelType;
      supportHeight: number;
      supportBorderRadius: number;
      supportPadding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
      handleSettings: {
        type: 'hole' | 'handle' | 'none'
        position: 'left' | 'top' | 'right' | 'bottom'
        size: number
        size2: number
        offsetX: number
        offsetY: number
      };
    };
    threePreviewSettings: {
      backgroundColor: number;
      groundColor: number;
      gridSize: number;
      gridDivisions: number;
      gridColor1: number;
      gridColor2: number;
      meshParameters: {
        color: number;
        emissive: number | undefined;
      };
    };
    googleFontApiKey: string;
    availableLanguages: string[];
    countApi: {
      namespace: string;
      key: string;
    }
  };
}
