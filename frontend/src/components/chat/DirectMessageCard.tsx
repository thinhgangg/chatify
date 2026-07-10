import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const otherUser = convo.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCounts = convo.unreadCount?.[user._id] ?? 0;
  const lastMessage = convo.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.displayName ?? ""}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCounts={unreadCounts}
      leftSection={
        <>
          <UserAvatar
            type="siderbar"
            name={otherUser.displayName ?? ""}
            avatarUrl={otherUser.avatarUrl ?? undefined}
          />

          {/* socket io */}
          <StatusBadge
            status={
              onlineUsers.includes(otherUser?._id || "") ? "online" : "offline"
            }
          />

          {unreadCounts > 0 && <UnreadCountBadge unreadCounts={unreadCounts} />}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-xs truncate",
            unreadCounts > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default DirectMessageCard;
