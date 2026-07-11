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

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isGroupBreak =
    index === 0 ||
    message.senderId !== prev?.senderId ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      1000 * 60 * 5;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );

  const lastOwnMessage = [...messages].reverse().find((m) => m.isOwn);

  const isLastOwnMessage = message._id === lastOwnMessage?._id;

  return (
    <>
      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8 ">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? ""}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message content */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
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
            <p className="text-sm leading-relaxed wrap-break-word">
              {message.content}
            </p>
          </Card>

          {/* status */}
          {isLastOwnMessage && (
            <span className="mt-1 px-1 text-[11px]">
              {lastMessageStatus === "delivered" && "Delivered"}
              {lastMessageStatus === "seen" && "Seen"}
            </span>
          )}
        </div>
      </div>

      {isGroupBreak && (
        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        </div>
      )}
    </>
  );
};

export default MessageItem;
