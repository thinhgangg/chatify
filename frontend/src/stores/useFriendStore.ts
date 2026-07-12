import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,

  searchByUsername: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchByUsername(username);
      return user;
    } catch (error) {
      console.error("Error searching user by username:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addFriend: async (to) => {
    try {
      set({ loading: true });
      return await friendService.sendFriendRequest(to);
    } finally {
      set({ loading: false });
    }
  },
}));
