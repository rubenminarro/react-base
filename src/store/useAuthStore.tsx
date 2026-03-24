import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    name: string;
    email: string;
    active: number;
    roles: string[];
}

interface AuthState {
    
    user: User | null;
    token: string | null;
  
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    hasRole: (roleName: string) => boolean;
    isAuthenticated: () => boolean;

}

export const useAuthStore = create<AuthState>()(
    
    persist(
       
        (set, get) => ({

            user: null,
            token: null,

            setAuth: (user: User, token: string) => {
                set({ user, token });
            },

            logout: () => {
                set({ user: null, token: null });
                
                localStorage.removeItem('auth-storage');
            },

            hasRole: (roleName: string) => {
                const user = get().user;
                if (!user) return false;
                return user.roles.includes(roleName);
            },

            isAuthenticated: () => {
                return !!get().token;
            },
        }),
    {
        name: 'auth-storage', // Nombre de la clave en LocalStorage
    })
);