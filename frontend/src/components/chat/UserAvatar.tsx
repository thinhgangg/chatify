import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

const userAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  const safeName = name?.trim() ? name : "User";
  const imageSrc = avatarUrl?.trim() ? avatarUrl : undefined;
  const bgColor = !imageSrc ? "bg-primary" : "";

  return (
    <Avatar
      className={cn(
        className,
        "",
        type === "sidebar" && "size-12 text-base",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl shadow-md",
      )}
    >
      <AvatarImage key={imageSrc ?? "fallback"} src={imageSrc} alt={safeName} />
      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {safeName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default userAvatar;
