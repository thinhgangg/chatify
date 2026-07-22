import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const TIME_GAP = 5 * 60 * 1000;

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  // Vì messages đã reverse() nên:
  // index 0 = tin mới nhất
  const previous =
    index + 1 < messages.length ? messages[index + 1] : undefined;

  const next = index > 0 ? messages[index - 1] : undefined;

  const sameSenderAsPrevious =
    previous && String(previous.senderId) === String(message.senderId);

  const sameSenderAsNext =
    next && String(next.senderId) === String(message.senderId);

  const closeToPrevious =
    previous &&
    new Date(message.createdAt).getTime() -
      new Date(previous.createdAt).getTime() <
      TIME_GAP;

  const closeToNext =
    next &&
    new Date(next.createdAt).getTime() - new Date(message.createdAt).getTime() <
      TIME_GAP;

  // Tin đầu của một cụm
  const isFirstInGroup = !sameSenderAsPrevious || !closeToPrevious;

  // Tin cuối của một cụm
  const isLastInGroup = !sameSenderAsNext || !closeToNext;

  // Chỉ hiện timestamp khi bắt đầu cụm
  const shouldShowTimestamp = isFirstInGroup;

  const participant = selectedConvo.participants.find(
    (p: Participant) => String(p._id) === String(message.senderId),
  );

  const isGroupChat = selectedConvo.type === "group";

  const lastOwnMessage = messages.find((m) => m.isOwn);

  const isLastOwnMessage = message._id === lastOwnMessage?._id;

  return (
    <div className="flex flex-col">
      {/* Timestamp */}
      {shouldShowTimestamp && (
        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        </div>
      )}

      {/* Display Name */}
      {isGroupChat && !message.isOwn && isFirstInGroup && (
        <div className="ml-10 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {participant?.displayName}
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex items-end gap-2",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* Avatar */}
        {!message.isOwn && isGroupChat ? (
          <div className="w-8 shrink-0">
            {isLastInGroup && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? ""}
                avatarUrl={participant?.avatarUrl}
              />
            )}
          </div>
        ) : (
          <div className="w-8 shrink-0" />
        )}

        {/* Bubble */}
        <div
          className={cn(
            "flex flex-col max-w-xs lg:max-w-md",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              "p-3",
              message.isOwn
                ? "bg-chat-bubble-sent border-0"
                : "bg-chat-bubble-received",
            )}
          >
            <p className="text-sm wrap-break-word">{message.content}</p>
          </Card>

          {isLastOwnMessage && (
            <span className="mt-1 px-1 text-[11px]">
              {lastMessageStatus === "delivered" && "Delivered"}
              {lastMessageStatus === "seen" && "Seen"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
