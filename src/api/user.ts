import useSWR from "swr";
import { fetcher } from "@/utils/swr";
import type { UserInfo } from "@/types";

export function useCurrentUser() {
  return useSWR<UserInfo>("/api/me", fetcher);
}

function getUserList() {
  return fetcher<UserInfo[]>("/api/users");
}

export function useUserList() {
  return useSWR<UserInfo[]>("/api/users", getUserList);
}
