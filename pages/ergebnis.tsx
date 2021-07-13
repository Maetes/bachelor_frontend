import { Box, Button, Flex, Link } from '@chakra-ui/react';
import Boxing from '../components/Boxing';
import { useRouter } from 'next/router';
import { TableWrapper } from '../components/TableWrapper';
import { useStateGlobal } from '../stateManagement/useStateGlobal';
import React from 'react';
import NextLink from 'next/link';

const Ergebnis = () => {
  const router = useRouter();
  const [
    {
      ergebnisState: { ergebnis: data },
    },
    setStateGlobal,
  ] = useStateGlobal();

  let { d, a, s, c } = router.query as {
    d: string;
    a: string;
    s: string;
    c: string;
  };

  return (
    <Flex alignItems='center' justify='center' p='1%' direction='column'>
      <Flex w='100%' justifyContent='space-between'>
        <Box>
          <Button
            colorScheme='cyan'
            variant='outline'
            onClick={() => {
              router.replace('/');
            }}
          >
            Start
          </Button>
        </Box>
        <Box>
          <Button
            colorScheme='cyan'
            variant='outline'
            onClick={() => {
              router.replace('/history');
            }}
          >
            Alle Durchläufe
          </Button>
        </Box>
      </Flex>
      <Boxing
        heading={'InputDaten'}
        elements={{
          Algorithmus: a,
          Datenset: d,
          Support: s,
          ...(c && { Konfidenz: c }),
        }}
      />
      {data.end.freqItems.freq && (
        <Boxing
          heading={'Ausgangswerte FreqItems'}
          elements={data.start.freqItems}
        />
      )}
      {data.end.association && (
        <Boxing
          heading={'Ausgangswerte Association'}
          elements={data.start.association}
        />
      )}

      {data.end.freqItems.freq && (
        <Boxing
          heading={'Messwerte FreqItems'}
          elements={data.end.freqItems}
          dont={'freq'}
        />
      )}

      {data.end.association && (
        <Boxing
          heading={'Messwerte Association'}
          elements={data.end.association}
          dont={'asso'}
        />
      )}

      {data.end.freqItems.freq && (
        <Boxing heading={'Frequent Patterns'}>
          <TableWrapper
            data={
              typeof data.end.freqItems.freq === 'string'
                ? JSON.parse(data.end.freqItems.freq)
                : data.end.freqItems.freq
            }
          />
        </Boxing>
      )}

      {data.end.association && (
        <Boxing heading={'Association rules'}>
          <TableWrapper
            data={
              typeof data.end.association.asso === 'string'
                ? JSON.parse(data.end.association.asso)
                : data.end.association.asso
            }
          />
        </Boxing>
      )}
    </Flex>
  );
};

export default Ergebnis;
