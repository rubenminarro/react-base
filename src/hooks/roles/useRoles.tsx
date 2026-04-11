import { useQuery } from "@tanstack/react-query";
import { api } from '../../lib/api';

export const useRoles = (search: string, page: number) => {
	return useQuery({
		queryKey: ['roles', search, page],
		queryFn: async () => {
			const response = await api.get(`api/admin/roles?search=${search}&page=${page}`);
			return response.data;
		},
		placeholderData: (prev) => prev,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 5,
	});
};