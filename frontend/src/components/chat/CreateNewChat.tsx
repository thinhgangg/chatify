import { useFriendStore } from "@/stores/useFriendStore";
import { Card } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { MessageCircle } from "lucide-react";
import FriendListModal from "../createNewChat/FriendListModal";

const CreateNewChat = () => {
  const { getAllFriends } = useFriendStore();

  const handleGetAllFriends = async () => {
    await getAllFriends();
  };

  return (
    <div className="flex gap-2">
      <Card
        className="flex-1 p-3 glass hover:shadow-soft transition-smooth cursor-pointer group"
        onClick={handleGetAllFriends}
      >
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="size-8 rounded-full bg-primary flex justify-center items-center">
                <MessageCircle className="size-4 text-white" />
              </div>
              <span className="text-sm font-medium capitalize">
                Create New Chat
              </span>
            </div>
          </DialogTrigger>

          <FriendListModal />
        </Dialog>
      </Card>
    </div>
  );
};

export default CreateNewChat;
