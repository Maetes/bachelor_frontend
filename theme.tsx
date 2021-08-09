import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { theme as chakraTheme } from '@chakra-ui/react';

const fonts = {
  ...chakraTheme.fonts,
};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const theme = extendTheme({
  colors: {
    black: '#16161D',
  },
  fonts,
  breakpoints,
});

export default theme;
