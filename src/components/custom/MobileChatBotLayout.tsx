'use client'
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import ChatBox from "@afs/app/(SavvyVault)/document/[docID]/Chat-box";
import { Id } from "../../../convex/_generated/dataModel";

export default function MobileChatBotLayout({ docId }: { docId: Id<"docs"> }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
      <DialogTrigger asChild>
        <Button className="lg:hidden" variant="outline" size="icon">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-2rem)] p-0 sm:max-w-[425px]">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatBox docId={docId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
