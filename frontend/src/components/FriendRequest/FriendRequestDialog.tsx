import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import SentRequest from "./SentRequest";
import ReceivedRequest from "./ReceivedRequest";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    loadRequests();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger
              className="data-active:bg-primary data-active:text-primary-foreground h-10"
              value="received"
            >
              Received
            </TabsTrigger>
            <TabsTrigger
              className="data-active:bg-primary data-active:text-primary-foreground h-10"
              value="sent"
            >
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <ReceivedRequest />
          </TabsContent>

          <TabsContent value="sent">
            <SentRequest />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
