import { useFriendStore } from "@/stores/useFriendStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MessageCircleMore, User } from "lucide-react";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/useChatStore";

const FriendListModal = () => {
  const { friends } = useFriendStore();
  const { createConversation } = useChatStore();
  const friendList = friends ?? [];

  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
  };

  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize">
          <MessageCircleMore className="size-5" />
          Start a New Chat
        </DialogTitle>
      </DialogHeader>

      {/* Friend list */}
      <div className="space-y-4">
        <h1 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Friends
        </h1>

        <div className="max-h-96 w-full beautiful-scrollbar">
          {friendList.map((friend) => (
            <Card
              key={friend._id}
              onClick={() => handleAddConversation(friend._id)}
              className="p-3 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard mb-3"
            >
              <div className="flex items-center gap-3">
                {/* avatar */}
                <div className="relative">
                  <UserAvatar
                    type="sidebar"
                    name={friend.displayName}
                    avatarUrl={friend.avatarUrl}
                  />
                </div>
                {/* info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h2 className="font-semibold text-sm truncate">
                    {friend.displayName}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    @{friend.username}
                  </span>
                </div>
              </div>
            </Card>
          ))}

          {friendList.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <User className="size-12 mx-auto mb-3 opacity-50" />
              You have no friends to start a chat with.
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
