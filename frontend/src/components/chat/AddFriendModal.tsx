import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequestForm from "../AddFriendModal/SendFriendRequestForm";

export interface IFrormValues {
  username: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState("");
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFrormValues>({
    defaultValues: {
      username: "",
    },
  });

  const usernameValue = watch("username");

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object"
    ) {
      const response = (
        error as {
          response?: { data?: { message?: string } };
        }
      ).response;

      const message = response?.data?.message;
      if (message) {
        return message;
      }
    }

    return "Unable to send friend request";
  };

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setSearchedUsername(username);

    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async () => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id);
      toast.success(message);

      handleCancel();
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(getErrorMessage(error));
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername("");
    setIsFound(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
          <UserPlus className="size-4" />
          <span className="sr-only">Add Friend</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-100 border-none">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>

        {!isFound && (
          <>
            <SearchForm
              register={register}
              error={errors}
              loading={loading}
              usernameValue={usernameValue}
              isFound={isFound}
              searchedUsername={searchedUsername}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          </>
        )}

        {isFound && (
          <>
            <SendFriendRequestForm
              register={register}
              loading={loading}
              searchedUsername={searchedUsername}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
