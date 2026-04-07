import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useDeletePermission = () => {
  
    const queryClient = useQueryClient();

	return useMutation({

		mutationFn: async (permissionId: number) => {
			const response = await api.delete(`/api/admin/permission/${permissionId}`);
			return response;
		},

		onSuccess: () => {
			//Opcional: refrescar lista de permisos
			queryClient.invalidateQueries({ queryKey: ['permissions'] });
		},
	});
};