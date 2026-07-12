import type { UseFormRegister } from "react-hook-form";
import type { IFrormValues } from "../chat/AddFriendModal";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

interface SendFriendRequestProps {
  register: UseFormRegister<IFrormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
}

const SendFriendRequestForm = ({
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendFriendRequestProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="success-message">
          Send a friend request to{" "}
          <span className="font-semibold">@{searchedUsername}</span>
        </span>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          className="flex-1 glass hover:text-destructive cursor-pointer"
          onClick={onBack}
        >
          Back
        </Button>

        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <UserPlus className="size-4" /> Send Request
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SendFriendRequestForm;
