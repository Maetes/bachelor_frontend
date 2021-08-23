import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Boxing from '../components/Boxing';
import { TableWrapper } from '../components/TableWrapper';

const hardCodedDatasets = [
  { Dataset: 'Beispieldatenset.txt' },
  { Dataset: 'Aldi_Ausgangsbasis.txt' },
  { Dataset: 'Rewe_Ausgangsbasis.txt' },
  { Dataset: 'Aldi_Transaktionen.txt' },
  { Dataset: 'Rewe_Transaktionen.txt' },
  { Dataset: 'Aldi_Warenkorb.txt' },
  { Dataset: 'Rewe_Warenkorb.txt' },
  { Dataset: 'Aldi_häufigeItemsets.txt' },
  { Dataset: 'Rewe_häufigeItemsets.txt' },
  { Dataset: 'Aldi_Items.txt' },
  { Dataset: 'Rewe_Items.txt' },
];

const Datasets = () => {
  const [selected, setSelected] = useState(false);
  const [receivedData, setReceivedData] = useState<number>(0);
  const router = useRouter();

  // Dieses Object löst den Push auf die Ergebnisseite aus, wenn sich die Daten ändern.
  useEffect(() => {
    if (selected) {
      console.log(hardCodedDatasets[receivedData].Dataset);
      location.assign(
        process.env.NEXT_PUBLIC_ENV_API +
          '/getDataset/' +
          hardCodedDatasets[receivedData].Dataset
      );
    }
  }, [receivedData, router, selected]);

  return (
    <Flex alignItems='center' justify='center' p='1%' direction='column'>
      <Flex w='100%'>
        <Button
          colorScheme='cyan'
          variant='outline'
          onClick={() => {
            router.push('/');
          }}
        >
          Start
        </Button>
      </Flex>
      <Boxing heading={'Verfügbare Datensets'}>
        {hardCodedDatasets.length > 0 ? (
          <TableWrapper
            data={hardCodedDatasets}
            itemSelected={setSelected}
            bounceBackData={setReceivedData}
            clickable
            headerText={'Dataset downloaden'}
            bodyText={'Möchten Sie das ausgewählte Dataset downloaden?'}
          />
        ) : (
          <>Loading...</>
        )}
      </Boxing>
    </Flex>
  );
};

export default Datasets;
