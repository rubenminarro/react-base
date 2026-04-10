import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface StorePermissionPayload {
	name: string;
	guard_name: string;
}

export const useStorePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: StorePermissionPayload) => {
			const response = await api.post("/api/admin/permission", data);
			return response.data;
		},
		onSuccess: () => {
			// refresca lista de permisos
			queryClient.invalidateQueries({ queryKey: ['permissions'] });
		}
	});
};