import { create } from 'zustand';
export const useResponsiveStore = create((set, get) => ({
    isMenuOpen: true,
    changeMenuState: () => {
        const currentState = get().isMenuOpen;
        set({ isMenuOpen: !currentState });
    },
}));
