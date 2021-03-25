export default config

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
  };
}
