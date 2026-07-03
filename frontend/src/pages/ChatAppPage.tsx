import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("Test request successful");
    } catch (error) {
      toast.error("Test request failed");
      console.error(error);
    }
  };

  return (
    <div>
      {user ? `Welcome, ${user.displayName}` : "Loading..."}
      <Logout />

      <Button onClick={handleOnClick}>Test</Button>
    </div>
  );
};

export default ChatAppPage;
