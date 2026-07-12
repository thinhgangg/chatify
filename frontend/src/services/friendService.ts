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
};
