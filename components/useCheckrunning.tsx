import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Return = [{ isLoading: boolean }, Dispatch<SetStateAction<boolean>>];

export const useCheckrunning = ({ jobid }: { jobid: string }): Return => {
  const [isLoading, setIsLoading] = useState(false);
  const [track, setTrack] = useState(false);
  const [startTracker, setStartTracker] = useState(false);
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_ENV_API + '/check/' + jobid,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
      refreshInterval: 3,
    }
  );

  useEffect(() => {
    if (track) {
      if (data !== 'COMPLETED') {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [data, error, track]);

  // const { data, error } = useSWR(daten ? fetchString : null, fetcher, {
  //   revalidateOnFocus: false,
  //   revalidateOnMount: cache ? false : true,
  //   revalidateOnReconnect: false,
  //   refreshWhenOffline: false,
  //   refreshWhenHidden: false,
  //   refreshInterval: 0,
  // });

  return [
    {
      isLoading,
    },
    setTrack,
  ];
};
