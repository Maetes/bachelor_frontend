import {
  Grid,
  GridItem,
  Flex,
  Container,
  Box,
  Code,
  Text,
  Spacer,
  Heading,
  Link,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Card } from '../components/Card';
import { ConfigForm } from '../components/ConfigForm';

const Index = () => {
  const router = useRouter();
  return (
    <Flex
      height='100vh'
      alignItems='center'
      justify='center'
      direction='column'
      p='1%'
    >
      <Flex w='100%' justifyContent='space-between'>
        <Button
          colorScheme='cyan'
          variant='outline'
          onClick={() => {
            router.push('/datasets');
          }}
        >
          Datensets
        </Button>
        <Button
          colorScheme='cyan'
          variant='outline'
          onClick={() => {
            router.push('/history');
          }}
        >
          Alle Durchläufe
        </Button>
      </Flex>
      <Card mb='auto'>
        <ConfigForm />
      </Card>
    </Flex>
  );
};

export default Index;
