import { create } from 'zustand';

export interface User {
  login: string;
  avatar_url: string;
  name?: string | null;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
}

interface StoreState {
  user: User | null;
  token: string | null;
  repositories: Repository[];
  currentRepo: Repository | null;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRepositories: (repos: Repository[]) => void;
  setCurrentRepo: (repo: Repository | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  token: null,
  repositories: [],
  currentRepo: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setRepositories: (repos) => set({ repositories: repos }),
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  logout: () => set({
    user: null,
    token: null,
    repositories: [],
    currentRepo: null,
  }),
}));

export default useStore;