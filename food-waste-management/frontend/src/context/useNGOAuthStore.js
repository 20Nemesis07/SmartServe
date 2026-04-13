import create from 'zustand';
import { ngoAPI } from '../utils/api';

const useNGOAuthStore = create((set) => ({
  ngo: JSON.parse(localStorage.getItem('ngo')) || null,
  token: localStorage.getItem('ngo_token') || null,
  isLoading: false,
  error: null,

  registerNGO: async (ngoData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await ngoAPI.registerNGO(ngoData);
      localStorage.setItem('ngo_token', data.token);
      localStorage.setItem('token', data.token); // Also store as 'token' for API interceptor
      localStorage.setItem('ngo', JSON.stringify(data.ngo));
      set({ ngo: data.ngo, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  loginNGO: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await ngoAPI.loginNGO({ email, password });
      localStorage.setItem('ngo_token', data.token);
      localStorage.setItem('token', data.token); // Also store as 'token' for API interceptor
      localStorage.setItem('ngo', JSON.stringify(data.ngo));
      set({ ngo: data.ngo, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logoutNGO: () => {
    localStorage.removeItem('ngo_token');
    localStorage.removeItem('token');
    localStorage.removeItem('ngo');
    set({ ngo: null, token: null, error: null });
  },

  updateNGOProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await ngoAPI.updateNGOProfile(profileData);
      localStorage.setItem('ngo', JSON.stringify(data.ngo));
      set({ ngo: data.ngo, isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Update failed';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('ngo_token');
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useNGOAuthStore;
