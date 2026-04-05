import { useQuery } from "@tanstack/react-query";
import { api } from '../lib/api';

export const usePermissions = (search: string, page: number) => {
	return useQuery({
		queryKey: ['permissions', search, page],
		queryFn: async () => {
			const response = await api.get(`api/admin/permissions?search=${search}&page=${page}`);
			return response.data;
		},
		placeholderData: (prev) => prev,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 5,
	});
};