import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
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
              setStateGlobal({ type: 'DELETE', payload: '' });
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
        heading={'Eingabe Daten'}
        elements={{
          Algorithmus: a,
          Datenset: d,
          Support: parseFloat(s) * 100 + '%',
          ...(c && { Konfidenz: parseFloat(c) * 100 + '%' }),
        }}
      />
      {data.end.freqItems.freq && (
        <Boxing
          heading={'Ausgangswerte Häufige Itemsets*'}
          elements={data.start.freqItems}
        />
      )}
      {data.end.association && (
        <Boxing
          heading={'Ausgangswerte Assoziationsregeln*'}
          elements={data.start.association}
        />
      )}
      {data.end.freqItems.freq && (
        <Boxing
          heading={'Messwerte Häufige Itemsets*'}
          elements={data.end.freqItems}
          dont={'freq'}
        />
      )}
      {data.end.association && (
        <Boxing
          heading={'Messwerte Assoziationsregeln*'}
          elements={data.end.association}
          dont={'asso'}
        />
      )}
      {data.end.freqItems.freq && (
        <Boxing heading={'Häufige Itemsets'}>
          {data.end.freqItems.freq === null ||
          (Array.isArray(data.end.freqItems.freq) &&
            !data.end.freqItems.freq.length) ? (
            <div>Keine FrequentPatterns gefunden!</div>
          ) : (
            <TableWrapper
              data={
                typeof data.end.freqItems.freq === 'string'
                  ? JSON.parse(data.end.freqItems.freq)
                  : data.end.freqItems.freq
              }
            />
          )}
        </Boxing>
      )}
      {data.end.association && (
        <Boxing heading={'Assoziationsregeln'}>
          {data.end.association.asso === null ||
          (Array.isArray(data.end.association.asso) &&
            !data.end.association.asso.length) ? (
            <div>Keine Assoziationsregeln gefunden!</div>
          ) : (
            <TableWrapper
              data={
                typeof data.end.association.asso === 'string'
                  ? JSON.parse(data.end.association.asso)
                  : data.end.association.asso
              }
            />
          )}
        </Boxing>
      )}
      <Text fontSize='xs' sx={{ alignSelf: 'flex-start' }}>
        * cpu / memory in Prozent | time in Sekunden
      </Text>
    </Flex>
  );
};

export default Ergebnis;
