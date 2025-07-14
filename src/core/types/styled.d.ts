import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: Record<number, string>;
      secondary: Record<number, string>;
      error: Record<number, string>;
      warning: Record<number, string>;
      success: Record<number, string>;
      neutral: Record<number, string>;
      background: {
        default: string;
        surface: string;
      };
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
