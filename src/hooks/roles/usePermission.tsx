import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const usePermission  = (permissionId: string | undefined) => {
    
    const userQuery = useQuery({
        queryKey: ['permissions', permissionId],
        queryFn: async () => {
            const res = await api.get(`/api/admin/permission/show/${permissionId}`);
            return res.data.data;
        },
        enabled: !!permissionId,
    });

    return {
        permission: userQuery.data,
        isLoading: userQuery.isLoading,
    };
    
};