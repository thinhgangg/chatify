import api from "@/lib/axios";

export const friendService = {
  async searchByUsername(username: string) {
    const res = await api.get(`/users/search?username=${username}`);
    return res.data.users;
  },

  async sendFriendRequest(to: string) {
    const res = await api.post(`/friends/request`, { to });
    return res.data.message;
  },

  async getAllFriendRequests() {
    try {
      const res = await api.get(`/friends/requests`);
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  },

  async acceptFriendRequest(requestId: string) {
    try {
      const res = await api.post(`/friends/requests/${requestId}/accept`);
      return res.data.requestAcceptedBy;
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  },

  async declineFriendRequest(requestId: string) {
    try {
      await api.post(`/friends/requests/${requestId}/decline`);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  },
};
