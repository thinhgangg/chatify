import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstname, lastname) => {
    try {
      set({ loading: true });

      await authService.signUp(username, password, email, firstname, lastname);

      toast.success("Sign up successful! Please log in.");
    } catch (error) {
      console.error(error);

      toast.error("Sign up failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);

      get().setAccessToken(accessToken);

      await get().fetchMe();

      toast.success("Sign in successful!");
    } catch (error) {
      console.error(error);

      toast.error("Sign in failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();

      await authService.signOut();

      toast.success("Log out successful!");
    } catch (error) {
      console.error(error);

      toast.error("Log out failed. Please try again.");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });

      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);

      set({ user: null, accessToken: null });

      toast.error("Failed to fetch user data. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });

      const { user, fetchMe } = get();

      const accessToken = await authService.refresh();

      get().setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      get().clearState();

      toast.error("Session expired. Please log in again.");
    } finally {
      set({ loading: false });
    }
  },
}));
