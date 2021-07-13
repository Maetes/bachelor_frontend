import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import React from 'react';
import { StateProvider } from '../stateManagement/useStateGlobal';
import { mainInitialState, mainReducer } from '../stateManagement/mainReducer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateProvider initialState={mainInitialState()} reducer={mainReducer}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </StateProvider>
  );
}
export default MyApp;
