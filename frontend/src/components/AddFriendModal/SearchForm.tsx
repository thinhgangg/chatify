import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFrormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFrormValues>;
  error: FieldErrors<IFrormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

const SearchForm = ({
  register,
  error,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          Username
        </Label>

        <Input
          id="username"
          placeholder="Enter username"
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          {...register("username", {
            required: "Username is required",
          })}
        ></Input>

        {error.username && (
          <p className="error-message">{error.username.message}</p>
        )}

        {isFound === false && (
          <span className="error-message">
            User not found
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 glass hover:text-destructive cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className="flex-1"
        >
          {loading ? (
            <span>Searching...</span>
          ) : (
            <>
              <Search className="size-4" /> Search
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
