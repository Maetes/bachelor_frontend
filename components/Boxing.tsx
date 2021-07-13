import { Flex, Box, Code, Text, Heading } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import React from 'react';

export interface Content2 {
  [anyDesc: string]: any[] | any;
}

const Boxing = ({
  heading,
  elements = undefined,
  dont = undefined,
  children = undefined,
}: {
  heading: string;
  elements?: Content2;
  dont?: string;
  children?: JSX.Element | JSX.Element[];
}) => {
  return (
    <Flex mb='5%' alignItems='center' flexDirection='column' w='100%'>
      <Heading as='h1' mb='5' isTruncated>
        {heading}
      </Heading>
      <Box
        w='100%'
        color='black'
        borderRadius='lg'
        overflow='hidden'
        borderColor='grey.100'
        borderWidth='1px'
        p='3%'
      >
        {elements && (
          <Flex width='100%' height='100%' direction='row'>
            {Object.keys(elements).map(
              (e, i) =>
                e !== dont && (
                  <Text fontSize='m' key={i} ml={i > 0 ? '4%' : '0%'}>
                    {e}:{' '}
                    <Code>
                      {Array.isArray(elements[e])
                        ? elements[e].map((f: string, g: number) =>
                            g + 1 === elements[e].length ? f : f + '; '
                          )
                        : elements[e]}
                    </Code>
                  </Text>
                )
            )}
          </Flex>
        )}
        {children}
      </Box>
    </Flex>
  );
};

export default Boxing;
