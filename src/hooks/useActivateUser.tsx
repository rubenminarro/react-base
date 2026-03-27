import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '../lib/api';

export const useActivateUser = () => {

  	const queryClient = useQueryClient();

	return useMutation({
		
		mutationFn: (userId: number) => api.post(`api/admin/users/${userId}/activate`),

		onMutate: async (userId: number) => {
			
			await queryClient.cancelQueries({ queryKey: ['users'] });

			const previousQueries = queryClient.getQueriesData({ queryKey: ['users'] });

			previousQueries.forEach(([queryKey, data]: any) => {
				
				if (!data) return;

				queryClient.setQueryData(queryKey, {
				...data,
				data: data.data.map((u: any) =>
					u.id === userId
					? { ...u, active: u.active === 1 ? 0 : 1 }
					: u
				),
				});
			});

			return { previousQueries };
		},

		onError: (err, userId, context) => {
		context?.previousQueries?.forEach(([queryKey, data]: any) => {
			queryClient.setQueryData(queryKey, data);
		});
		},
	});
};