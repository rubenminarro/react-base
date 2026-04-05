import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '../lib/api';

export const useActivatePermission = () => {

  	const queryClient = useQueryClient();

	return useMutation({
		
		mutationFn: (permissionId: number) => api.post(`api/admin/permission/activate/${permissionId}`),

		onMutate: async (permissionId: number) => {
			
			await queryClient.cancelQueries({ queryKey: ['permissions'] });

			const previousQueries = queryClient.getQueriesData({ queryKey: ['permissions'] });

			previousQueries.forEach(([queryKey, data]: any) => {
				
				if (!data) return;

				queryClient.setQueryData(queryKey, {
				...data,
				data: data.data.map((p: any) =>
					p.id === permissionId
					? { ...p, active: p.active === 1 ? 0 : 1 }
					: p
				),
				});
			});

			return { previousQueries };
		},

		onError: (err, permissionId, context) => {
		context?.previousQueries?.forEach(([queryKey, data]: any) => {
			queryClient.setQueryData(queryKey, data);
		});
		},
	});
};