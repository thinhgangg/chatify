import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequest = () => {
  const { sentList } = useFriendStore();
  if (!sentList || sentList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No sent friend requests
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((request) => (
          <FriendRequestItem
            key={request._id}
            requestInfo={request}
            type="sent"
            action={<p className="text-muted-foreground text-sm">Pending...</p>}
          />
        ))}
      </>
    </div>
  );
};

export default SentRequest;
