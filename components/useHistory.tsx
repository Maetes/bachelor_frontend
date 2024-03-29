import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useHistory = () => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_ENV_API + '/history',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
