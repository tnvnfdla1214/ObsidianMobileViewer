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

export interface FileInfo {
  name: string;
  path: string;
  content: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  currentRepo: Repository | null;
  currentPath: string;
  currentFile: FileInfo | null;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setCurrentRepo: (repo: Repository | null) => void;
  setCurrentPath: (path: string) => void;
  setCurrentFile: (file: FileInfo | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  token: null,
  currentRepo: null,
  currentPath: '',
  currentFile: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  setCurrentPath: (path) => set({ currentPath: path }),
  setCurrentFile: (file) => set({ currentFile: file }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  logout: () => set({
    user: null,
    token: null,
    currentRepo: null,
    currentPath: '',
    currentFile: null,
    isLoading: false,
  }),
}));

export default useStore;