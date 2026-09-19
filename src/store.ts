import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  role: 'owner' | 'admin' | 'sales' | null;
  setUser: (user: User | null) => void;
  setRole: (role: 'owner' | 'admin' | 'sales' | null) => void;
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  isInitialized: false,
  setInitialized: (val) => set({ isInitialized: val }),
}));

interface ProfileState {
  lockedEmail: string | null;
  lockedRole: string | null;
  lockedName: string | null;
  setLockedEmail: (email: string | null) => void;
  setLockedRole: (role: string | null) => void;
  setLockedName: (name: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      lockedEmail: null,
      lockedRole: null,
      lockedName: null,
      setLockedEmail: (email) => set({ lockedEmail: email }),
      setLockedRole: (role) => set({ lockedRole: role }),
      setLockedName: (name) => set({ lockedName: name }),
    }),
    {
      name: 'solarithm-profile-lock',
    }
  )
);
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'solarithm-theme',
    }
  )
);
