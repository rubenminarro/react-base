import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface StorePermissionPayload {
	name: string;
	description: string;
	guard_name: string;
	permissions: string[];
}

export const useStoreRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: StorePermissionPayload) => {
			const response = await api.post("/api/admin/role", data);
			return response.data;
		},
		onSuccess: () => {
			// refresca lista de roles
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		}
	});
};