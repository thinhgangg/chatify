import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus, Users } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../createNewGroupChat/InviteSuggestionList";
import SelectedUsersList from "../createNewGroupChat/SelectedUsersList";
import { toast } from "sonner";
import { useChatStore } from "@/stores/useChatStore";
import { Button } from "../ui/button";

const NewGroupChatModal = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getAllFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { loading, createConversation } = useChatStore();

  const handleGetFriends = async () => {
    await getAllFriends();
  };

  const handleSelectFriends = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveUser = (user: Friend) => {
    setInvitedUsers(
      invitedUsers.filter((invitedUser) => invitedUser._id !== user._id),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length === 0) {
        toast.warning("Please select at least one friend to invite.");
        return;
      }

      await createConversation(
        "group",
        groupName,
        invitedUsers.map((user) => user._id),
      );

      setSearch("");
      setInvitedUsers([]);
      setGroupName("");
      toast.success("Group chat created successfully!");
    } catch (error) {
      console.error("Error creating group chat:", error);
      toast.error("Failed to create group chat. Please try again later.");
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !invitedUsers.some((user) => user._id === friend._id),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleGetFriends}
          className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer"
        >
          <Users className="size-4" />
          <span className="sr-only">New Group Chat</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-100 border-none">
        <DialogHeader>
          <DialogTitle>New Group Chat</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Group Name
            </Label>

            <Input
              id="groupName"
              placeholder="Enter group name"
              className="glass border-border/50 focus:border-primary/50 transition-smooth"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite" className="text-sm font-semibold">
              Invite Friends
            </Label>

            {/* search input */}
            <Input
              id="invite"
              placeholder="Search friends..."
              className="glass border-border/50 focus:border-primary/50 transition-smooth"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* invite suggestion list */}
            {search && filteredFriends.length > 0 && (
              <InviteSuggestionList
                filteredFriends={filteredFriends}
                onSelect={handleSelectFriends}
              />
            )}

            {/* selected users */}
            <SelectedUsersList
              invitedUsers={invitedUsers}
              onRemove={handleRemoveUser}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1  bg-primary/70 hover:bg-primary/50 text-primary-foreground *:transition-smooth"
            >
              {loading ? (
                <span>Creating...</span>
              ) : (
                <>
                  <UserPlus className="size-4 mr-2" />
                  Create Group Chat
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;
