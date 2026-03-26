import { create } from "zustand";

interface SearchStore {
    search: string;
    setSearch: (value: string) => void;
    showSearch: boolean;
    toggleSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    search: "",
    showSearch: false,

    setSearch: (value) => set({ search: value }),

    toggleSearch: () =>
        set((state) => ({
            showSearch: !state.showSearch,
            search: state.showSearch ? "" : state.search, // limpia al cerrar
        })
    ),
}));