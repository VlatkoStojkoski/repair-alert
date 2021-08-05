import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  colors: {
    brand_blue: {
      100: '#a9d6e5',
      200: '#89c2d9',
      300: '#61a5c2',
      400: '#468faf',
      500: '#2c7da0',
      600: '#2a6f97',
      700: '#014f86',
      800: '#013a63',
      900: '#012a4a',
    },
    brand_red: {
      100: '#f7a1a7',
      200: '#f38b92',
      300: '#f07a82',
      400: '#eb666f',
      500: '#e7555f',
      600: '#e3404b',
      700: '#df2b37',
      800: '#d71d2d',
      900: '#cb111d',
    },
  },
  sizes: {
    fill_h: `${window.innerHeight}px`,
  },
});
