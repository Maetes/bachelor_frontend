import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import useSWR from 'swr';

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Prop {
  daten: string | null;
  algorithm: string;
  support: string;
  confidence?: string;
}

type Return = [
  { data: any; isLoading: boolean; isError: boolean },
  Dispatch<SetStateAction<boolean>>
];

export const useAlgorithm = ({
  daten,
  algorithm,
  support,
  confidence = '0',
}: // cache = false,
Prop): Return => {
  const [fetch, setFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [results, setResults] = useState<any>();

  useEffect(() => {
    if (fetch) {
      const fetchString =
        confidence !== '0'
          ? 'http://localhost:5000/run/' +
            algorithm +
            '?data=' +
            daten +
            '&support=' +
            support +
            '&confidence=' +
            confidence
          : 'http://localhost:5000/run/' +
            algorithm +
            '?data=' +
            daten +
            '&support=' +
            support;

      const res = async () => {
        setIsError(false);
        setLoading(true);
        try {
          const resp = await axios.get(fetchString);
          setResults(resp.data);
        } catch (error) {
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };
      res();
    }
  }, [algorithm, confidence, daten, fetch, support]);

  return [{ data: results, isLoading: loading, isError: isError }, setFetch];

  // const { data, error } = useSWR(daten ? fetchString : null, fetcher, {
  //   revalidateOnFocus: false,
  //   revalidateOnMount: cache ? false : true,
  //   revalidateOnReconnect: false,
  //   refreshWhenOffline: false,
  //   refreshWhenHidden: false,
  //   refreshInterval: 0,
  // });
};
