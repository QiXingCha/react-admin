import useSWR from 'swr';
import { fetcher } from '@/utils/swr';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export function useRoleList() {
  return useSWR<Role[]>('/api/roles', fetcher);
}
