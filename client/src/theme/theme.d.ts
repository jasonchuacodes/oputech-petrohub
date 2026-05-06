import {
  Palette,
  PaletteOptions,
  PaletteColor,
  SimplePaletteColorOptions,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    surface: string;
  }

  interface Palette {
    background: TypeBackground;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }

  interface PaletteColor {
    background?: string;
    surface?: string;
    alpha?: string;
  }

  interface SimplePaletteColorOptions {
    background?: string;
    surface?: string;
    alpha?: string;
  }
}
