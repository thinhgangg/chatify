import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser, fetchMe } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);
      const avatarUrl = data?.avatarUrl ?? data?.user?.avatarUrl ?? data?.user;

      if (user) {
        setUser({
          ...user,
          avatarUrl,
        });

        await fetchMe();
        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    }
  },
}));
