import { Badge } from "../ui/badge";

const UnreadCountBadge = ({ unreadCounts }: { unreadCounts: number }) => {
  return (
    <div className="pulse-ring absolute z-20 -top-1 -right-1">
      <Badge
        variant="secondary"
        className="size-5 flex items-center justify-center p-0 text-xs border border-background"
      >
        {unreadCounts > 9 ? "9+" : unreadCounts}
      </Badge>
    </div>
  );
};
  
export default UnreadCountBadge;
