import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Prop {
  jobid: string;
}

type Return = [
  { result: any; isError: { status: boolean; message: string } },
  Dispatch<SetStateAction<boolean>>,
  Dispatch<SetStateAction<{ status: boolean; message: string }>>
];

export const useResult = ({
  jobid,
}: // cache = false,
Prop): Return => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, message: '' });
  const [get, setGet] = useState<any>(false);
  const [result, setResult] = useState();

  useEffect(() => {
    if (get) {
      const fetchString = process.env.NEXT_PUBLIC_ENV_API + '/results/' + jobid;
      const res = async () => {
        setIsError({ status: false, message: '' });
        setLoading(true);
        try {
          const resp = await axios.get(fetchString);
          setResult(resp.data);
        } catch (error) {
          setIsError({ status: true, message: error.response.data });
        } finally {
          setLoading(false);
        }
      };
      res();
    }
  }, [get, jobid]);

  return [{ result: result, isError: isError }, setGet, setIsError];

  // const { data, error } = useSWR(daten ? fetchString : null, fetcher, {
  //   revalidateOnFocus: false,
  //   revalidateOnMount: cache ? false : true,
  //   revalidateOnReconnect: false,
  //   refreshWhenOffline: false,
  //   refreshWhenHidden: false,
  //   refreshInterval: 0,
  // });
};
