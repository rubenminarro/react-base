import { create } from "zustand";

interface SearchStore {
    search: string;
    setSearch: (value: string) => void;
    showSearch: boolean;
    toggleSearch: () => void;
}

export const usePermissionSearchStore = create<SearchStore>((set) => ({
    search: "",
    showSearch: false,

    setSearch: (value) => set({ search: value }),

    toggleSearch: () =>
        set((state) => {
            const nextShowSearch = !state.showSearch;
            return {
                showSearch: nextShowSearch,
                search: nextShowSearch ? state.search : "",
            };
        }),
}));