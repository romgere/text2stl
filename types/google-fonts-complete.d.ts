declare module 'google-fonts-complete' {

  interface FontData {
    local: string[];
    url: {
      eot?: string;
      svg?: string;
      ttf?: string;
      woff?: string;
      woff2?: string;
    };
  }

  interface FontVariant {
    [size: string]: FontData;
  }

  interface Font {
    category: string;
    lastModified: string;
    subsets: string[];
    variants: {
      [variant: string]: FontVariant; // 'italic'|'normal'
    };
    version: string;
  }

  const fonts: { [name: string]: Font }

  export default fonts
}
