import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ReceivedRequest = () => {
  const { acceptFriendRequest, declineFriendRequest, loading, receivedList } =
    useFriendStore();
  if (!receivedList || receivedList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No received friend requests
      </div>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.info("Friend request declined.");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <>
        {receivedList.map((request) => (
          <FriendRequestItem
            key={request._id}
            requestInfo={request}
            type="received"
            action={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDecline(request._id)}
                  disabled={loading}
                >
                  Decline
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleAccept(request._id)}
                  disabled={loading}
                >
                  Accept
                </Button>
              </div>
            }
          />
        ))}
      </>
    </div>
  );
};

export default ReceivedRequest;
