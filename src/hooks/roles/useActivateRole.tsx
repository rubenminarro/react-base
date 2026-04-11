import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '../../lib/api';

export const useActivateRole = () => {

  	const queryClient = useQueryClient();

	return useMutation({
		
		mutationFn: (roleId: number) => api.post(`api/admin/role/activate/${roleId}`),

		onMutate: async (roleId: number) => {
			
			await queryClient.cancelQueries({ queryKey: ['roles'] });

			const previousQueries = queryClient.getQueriesData({ queryKey: ['roles'] });

			previousQueries.forEach(([queryKey, data]: any) => {
				
				if (!data) return;

				queryClient.setQueryData(queryKey, {
				...data,
				data: data.data.map((p: any) =>
					p.id === roleId
					? { ...p, active: p.active === 1 ? 0 : 1 }
					: p
				),
				});
			});

			return { previousQueries };
		},
	});
};