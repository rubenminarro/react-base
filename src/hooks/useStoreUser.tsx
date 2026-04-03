import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface StoreUserPayload {
	name: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string[];
}

export const useStoreUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: StoreUserPayload) => {
			const response = await api.post("/api/admin/user", data);
			return response.data;
		},
		onSuccess: () => {
			// refresca lista de usuarios
			queryClient.invalidateQueries({ queryKey: ['users'] });
		}
	});
};