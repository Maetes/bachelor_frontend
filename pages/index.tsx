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
    >
      <Flex w='100%' mb='auto' p='1rem' justifyContent='flex-end'>
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
