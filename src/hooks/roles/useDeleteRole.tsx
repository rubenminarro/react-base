import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const useDeleteRole = () => {
  
    const queryClient = useQueryClient();

	return useMutation({

		mutationFn: async (roleId: number) => {
			const response = await api.delete(`/api/admin/role/${roleId}`);
			return response;
		},

		onSuccess: () => {
			//Opcional: refrescar lista de roles
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},
	});
};