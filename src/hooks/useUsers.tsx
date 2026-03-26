import { useQuery } from "@tanstack/react-query";
import { api } from '../lib/api';

export const useUsers = (search: string, page: number) => {
  return useQuery({
    queryKey: ['users', search, page],
    queryFn: async () => {
        const response = await api.get(`api/admin/users?search=${search}&page=${page}`);
        return response.data; // Esto devuelve el objeto completo con "data" y "meta"
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};