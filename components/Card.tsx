import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

export const Card = (props: BoxProps) => (
  <Box
    bg={useColorModeValue('aliceblue', 'gray.700')}
    py='8'
    px={{ base: '4', md: '10' }}
    shadow='dark-lg'
    rounded={{ sm: 'lg' }}
    {...props}
  />
);
