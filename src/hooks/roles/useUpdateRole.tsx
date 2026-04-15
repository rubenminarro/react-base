import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface UpdateRolePayload {
    id: string | undefined;
    data: {
        name: string;
        description: string;
        guard_name: string;
        permissions: string[];
    };
}

export const useUpdateRole = () => {
  
    const queryClient = useQueryClient();

	return useMutation({

		mutationFn: async ({ id, data }: UpdateRolePayload) => {
			const response = await api.put(`/api/admin/role/${id}`, data);
			return response.data;
		},

		onSuccess: (variables) => {
			//Refresca el role actualizado
			queryClient.invalidateQueries({ queryKey: ['role', variables.id] });

			//Opcional: refrescar lista de usuarios
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},

		onError: (error: any) => {
			console.error("Error actualizando role:", error);
		}
	});
};