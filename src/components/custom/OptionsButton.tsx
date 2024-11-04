"use client";

import { useState } from "react";
import { Button } from "@afs/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@afs/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@afs/components/ui/alert-dialog";
import { Bookmark, MoreVertical, Trash } from "lucide-react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { toast } from "@afs/hooks/use-toast";
import { Pencil } from "lucide-react";
import { UploadDoc } from "./UploadFiele";
import { BookmarkCheck } from "lucide-react";

export default function OptionButton({
  doc,
  saved,
  user,
}: {
  doc: Doc<"docs">;
  saved: boolean;
  user: Doc<"users"> | null;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { organization } = useOrganization();

  const { userId, orgRole } = useAuth();

  const deleteDoc = useMutation(api.document.deleteDocument);
  const savedocument = useMutation(api.document.toggleSaveDoc);

  const handleDelete = () => {
    console.log(editing);
    // Implement your delete logic here
    try {
      console.log({ docId: doc._id, orgId: organization?.id });
      deleteDoc({ docId: doc._id, orgId: organization?.id });
      console.log("Item deleted");
      setShowDeleteDialog(false);
      // alert
      toast({
        variant: "success",
        title: "1 document deleted successfully",
        description: organization
          ? `1 document has been deleted in ${organization.name}`
          : "1 document has been deleted from your personal space",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "somethig went wrong",
        description: "you can't perfom this action",
      });
    }
  };

  async function saveDoc() {
    try {
      const savedoc = await savedocument({
        docId: doc._id,
        orgId: organization?.id,
      });
      // alert
      toast({
        variant: "success",
        title: "1 document deleted successfully",
        description: organization
          ? `1 document has been deleted in ${organization.name}`
          : "1 document has been deleted from your personal space",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "somethig went wrong",
        description: "you can't perfom this action",
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {doc.tokenIdentifier == userId ||
          user?.orgIds
            .find((org) => org.orgId == organization?.id)
            ?.role.includes("admin") ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          ) : (
            ""
          )}
          {doc.tokenIdentifier == userId ||
          user?.orgIds
            .find((org) => org.orgId == organization?.id)
            ?.role.includes("admin") ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setEditing(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </>
          ) : (
            ""
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => saveDoc()}
          >
            {!saved ? (
              <Bookmark className="mr-2 h-4 w-4" />
            ) : (
              <BookmarkCheck className="mr-2 h-4 w-4" />
            )}
            <span>{!saved ? "save" : "unsave"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editing ? (
        <UploadDoc
          setEditing={setEditing}
          editMode={true}
          editing={editing}
          doc={doc}
        />
      ) : (
        ""
      )}
    </>
  );
}
