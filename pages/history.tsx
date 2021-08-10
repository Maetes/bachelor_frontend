import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Boxing from '../components/Boxing';
import { TableWrapper } from '../components/TableWrapper';
import { useHistory } from '../components/useHistory';
import { useItem } from '../components/useItem';
import { useStateGlobal } from '../stateManagement/useStateGlobal';

interface BouncedBackData {}

type HistData = [{ [string: string]: string }];

type TableData = {
  Zeitstempel: string | string[];
  Algorithmus: string | string[];
  Dataset: string | string[];
  Support: string | string[];
  Confidence: string | string[];
};

const History = () => {
  const {
    data,
    isLoading,
    isError,
  }: { data: HistData; isLoading: boolean; isError: boolean } = useHistory();
  const [selected, setSelected] = useState(false);
  const [receivedData, setReceivedData] = useState<number>(0);
  const [{}, setStateGlobal] = useStateGlobal();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const router = useRouter();
  const [idArray, setIdArray] = useState<number[]>([]);

  let [
    { data: rsl, isLoading: isLoadingItem, isError: isErrorItem },
    setFetch,
  ] = useItem();

  // dieser Hook aktualisert das Builded Object, wenn sich die Daten die erhalten werden Ändern! Das wars!
  const buildReturner = useCallback((receivedData) => {
    return {
      start: {
        association: {
          cpu: JSON.parse(receivedData.Association_Start_CPU),
          memory: JSON.parse(receivedData.Association_Start_Memory),
        },
        freqItems: {
          cpu: JSON.parse(receivedData.FrequentItems_Start_CPU),
          memory: JSON.parse(receivedData.FrequentItems_Start_Memory),
        },
      },
      end: {
        association: {
          asso: JSON.parse(receivedData.Association_Ende_Association_rules),
          cpu: JSON.parse(receivedData.Association_Ende_CPU),
          memory: JSON.parse(receivedData.Association_Ende_Memory),
          time: JSON.parse(receivedData.Association_Ende_Zeit),
        },
        freqItems: {
          freq: receivedData.FrequentItems_Ende_Frequent_items,
          cpu: JSON.parse(receivedData.FrequentItems_Ende_CPU),
          memory: JSON.parse(receivedData.FrequentItems_Ende_Memory),
          time: JSON.parse(receivedData.FrequentItems_Ende_Zeit),
        },
      },
    };
  }, []);

  // Dieses Object löst den Push auf die Ergebnisseite aus, wenn sich die Daten ändern.
  useEffect(() => {
    if (selected) {
      const idOfItem = idArray[receivedData];
      setFetch(idOfItem);
    }
  }, [idArray, receivedData, selected, setFetch]);

  useEffect(() => {
    if (rsl && !isLoadingItem) {
      setFetch(0);
      const returner = buildReturner(rsl);
      setStateGlobal({ type: 'CREATE', payload: returner });

      router.push({
        pathname: '/ergebnis',
        query: {
          d: JSON.parse(data[receivedData].Dataset),
          a: JSON.parse(data[receivedData].Algorithmus),
          s: JSON.parse(data[receivedData].Support),
          ...(data[receivedData].Confidence && {
            c: JSON.parse(data[receivedData].Confidence),
          }),
        },
      });
    }
  }, [
    buildReturner,
    data,
    isLoadingItem,
    receivedData,
    router,
    rsl,
    setFetch,
    setStateGlobal,
  ]);

  //Damit die Tabelle der History nicht zu groß wird werden nur wichtige Daten angezeigt
  useEffect(() => {
    if (data) {
      // const redu = (acc, cur) => {if(cur.Algorithm)}
      const tdata: TableData[] = [];

      data.map((e, i) => {
        setIdArray((idArray) => [...idArray, e.id as unknown as number]);
        tdata.push({
          Zeitstempel: e.Zeitstempel,
          Algorithmus: e.Algorithmus,
          Dataset: e.Dataset,
          Support: e.Support,
          Confidence: e.Confidence,
        });
      });
      setTableData(tdata);
    }
  }, [data]);

  return (
    <Flex alignItems='center' justify='center' p='1%' direction='column'>
      <Flex w='100%'>
        <Button
          colorScheme='cyan'
          variant='outline'
          onClick={() => {
            setStateGlobal({ type: 'DELETE', payload: '' });
            router.push('/');
          }}
        >
          Start
        </Button>
      </Flex>
      <Boxing heading={'Historie aller Algorithmendurchläufe'}>
        {!isLoading && tableData.length > 0 ? (
          <TableWrapper
            data={tableData}
            itemSelected={setSelected}
            bounceBackData={setReceivedData}
            clickable
          />
        ) : (
          <>Loading...</>
        )}
      </Boxing>
    </Flex>
  );
};

export default History;
