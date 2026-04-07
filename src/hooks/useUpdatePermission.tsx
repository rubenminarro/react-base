import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface UpdatePermissionPayload {
    id: string | undefined;
    data: {
        name: string;
        guard_name: string;
	};
}

export const useUpdatePermission = () => {
  
    const queryClient = useQueryClient();

	return useMutation({

		mutationFn: async ({ id, data }: UpdatePermissionPayload) => {
			const response = await api.put(`/api/admin/permission/${id}`, data);
			return response.data;
		},

		onSuccess: (data, variables) => {
			//Refresca el permiso actualizado
			queryClient.invalidateQueries({ queryKey: ['permissions', variables.id] });

			//Opcional: refrescar lista de usuarios
			queryClient.invalidateQueries({ queryKey: ['permissions'] });
		},

		onError: (error: any) => {
			console.error("Error actualizando permiso:", error);
		}
	});
};