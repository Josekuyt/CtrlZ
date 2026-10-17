import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Escala neutra (de las variables de Figma · colección «Colores»)
        neutro: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
          1000: '#000000',
        },
        // Escala del acento rojo corporativo (#EB0000 = rojo/500)
        rojo: {
          50: '#fde5e5',
          100: '#fbcccc',
          200: '#f79e9e',
          300: '#f36b6b',
          400: '#ef2e2e',
          500: '#eb0000',
          600: '#c80000',
          700: '#a00000',
          800: '#7a0000',
          900: '#570000',
          950: '#3b0000',
        },
        // Semánticos (compatibilidad con componentes existentes)
        acento: '#eb0000',
        tinta: '#171717',
        papel: '#ffffff',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
