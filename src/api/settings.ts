import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '@/utils/swr';
import { api } from '@/utils/api';

export interface Settings {
  siteName: string;
  logo?: string;
  theme: string;
}

export function useSettings() {
  return useSWR<Settings>('/api/settings', fetcher);
}

export function useUpdateSettings() {
  const { mutate } = useSWRConfig();

  return async (data: Partial<Settings>) => {
    const res = await api.put<Settings>('/api/settings', data);
    if (res.success && res.data) {
      mutate('/api/settings', res.data, false);
    }
    return res;
  };
}
