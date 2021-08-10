import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Return = [
  { data: any; isLoading: boolean; isError: boolean },
  Dispatch<SetStateAction<number>>
];

export const useItem = (): Return => {
  const [fetch, setFetch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [results, setResults] = useState<any>();

  useEffect(() => {
    if (fetch !== 0) {
      const res = async () => {
        setIsError(false);
        setLoading(true);
        try {
          const resp = await axios.get(
            process.env.NEXT_PUBLIC_ENV_API + '/getID/' + fetch
          );
          setResults(resp.data);
        } catch (error) {
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };
      res();
    }
  }, [fetch]);

  return [{ data: results, isLoading: loading, isError: isError }, setFetch];
};
