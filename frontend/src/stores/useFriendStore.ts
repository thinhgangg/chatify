import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],

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

  getAllFriendRequests: async () => {
    try {
      set({ loading: true });

      const result = await friendService.getAllFriendRequests();
      if (!result) return;

      const { sent, received } = result;

      set({
        sentList: sent,
        receivedList: received,
      });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId,
        ),
      }));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      set({ loading: false });
    }
  },

  declineFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineFriendRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId,
        ),
      }));
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
