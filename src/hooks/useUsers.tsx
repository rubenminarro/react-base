import { useQuery } from "@tanstack/react-query";
import { api } from '../lib/api';

export const useUsers = (search: string, page: number) => {
  return useQuery({
    queryKey: ['users', search, page],
    queryFn: async () => {
        const response = await api.get(`api/admin/users?search=${search}&page=${page}`);
        return response.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
};