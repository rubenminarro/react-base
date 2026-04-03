import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface UpdateUserPayload {
    id: string | undefined;
    data: {
        name: string;
        email: string;
        first_name?: string;
        last_name?: string;
        password?: string;
        password_confirmation?: string;
        role: string[];
    };
}

export const useUpdateUser = () => {
  
    const queryClient = useQueryClient();

	return useMutation({

		mutationFn: async ({ id, data }: UpdateUserPayload) => {
			const response = await api.put(`/api/admin/user/${id}`, data);
			return response.data;
		},

		onSuccess: (data, variables) => {
			//Refresca el usuario actualizado
			queryClient.invalidateQueries({ queryKey: ['user', variables.id] });

			//Opcional: refrescar lista de usuarios
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},

		onError: (error: any) => {
			console.error("Error actualizando usuario:", error);
		}
	});
};