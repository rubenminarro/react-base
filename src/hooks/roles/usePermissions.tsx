import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const usePermissions  = () => {
    
    const permissionsQuery = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const res = await api.get('/api/admin/role/permissions');
            return res.data.data;
        },
    });

    return {
        permissions: permissionsQuery.data,
        isLoading: permissionsQuery.isLoading,
    };
    
};