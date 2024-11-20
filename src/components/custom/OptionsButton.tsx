"use client";

import { useRef, useState } from "react";
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
import { Bookmark, MoreVertical, Trash, UndoIcon } from "lucide-react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { toast } from "@afs/hooks/use-toast";
import { Pencil } from "lucide-react";
import { UploadDoc } from "./UploadFiele";
import { BookmarkCheck } from "lucide-react";
import { Download } from 'lucide-react';

export default function OptionButton({
  doc,
  saved,
  user,
  restore,
}: {
  doc: Doc<"docs">;
  saved: boolean;
  user: Doc<"users"> | null;
  restore?: boolean;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { organization } = useOrganization();

  const { userId, orgRole } = useAuth();

  const moveToTrash = useMutation(api.document.moveToTrash);
  const savedocument = useMutation(api.document.toggleSaveDoc);

  // for restore page
  const restoreDoc = useMutation(api.document.restoreDocument);
  const deleteDoc = useMutation(api.document.deleteDocument);

  // move to trash
  const MoveDocToTrash = () => {
    console.log(editing);
    // Implement your delete logic here
    try {
      moveToTrash({ docId: doc._id, orgId: organization?.id });
      setShowDeleteDialog(false);
      // alert
      toast({
        variant: "success",
        title: "moved to trash successfully",
        description: `1 document has been moved to trash`,
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

  // delete permently
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

  // saving file
  async function saveDoc() {
    try {
      const savedoc = await savedocument({
        docId: doc._id,
        orgId: organization?.id,
      });
      // alert
      toast({
        variant: "success",
        title: "document saved successfully",
        description: organization && saved
          ? `1 document has been unsaved from ${organization.name}`
          : organization && !saved ? `1 document has been saved from ${organization.name}` : !organization && saved ? "1 document has been unsaved from your personal space" : !organization && !saved ? "1 document has been saved from your personal space",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "somethig went wrong",
        description: "you can't perfom this action",
      });
    }
  }

  // saving file
  async function RestoreDoc() {
    try {
      const savedoc = await restoreDoc({
        docId: doc._id,
        orgId: organization?.id,
      });
      // alert
      toast({
        variant: "success",
        title: "document restored successfully",
        description: organization
          ? `1 document has restored successfully`
          : "1 document has been saved from your personal space",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "somethig went wrong",
        description: "you can't perfom this action",
      });
    }
  }


  // download file 
  async function downloadfile(filename : string, DocUrl : string) {
      try {
        const response = await fetch(DocUrl);
        const blob = await response.blob();
        
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        
        link.href = blobUrl;
        link.download = filename; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
      }
  }

  function allowEditDelete() {
    if (
      doc.tokenIdentifier == userId ||
      user?.orgIds
        .find((org) => org.orgId == organization?.id)
        ?.role.includes("admin")
    ) {
      if (!restore) {
        return true;
      }
    }
    return false;
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

          {allowEditDelete() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>{!restore ? "move to trash" : "delete"}</span>
              </DropdownMenuItem>
            </>
          ) : (
            ""
          )}
          {allowEditDelete() ? (
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
          {allowEditDelete() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => downloadfile(doc.name,doc.docUrl)}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            </>
          ) : (
            ""
          )}
          {restore ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span> delete</span>
              </DropdownMenuItem>
            </>
          ) : (
            ""
          )}
          {!restore ? (
            <>
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
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => RestoreDoc()}
              >
                <UndoIcon className="mr-2 h-4 w-4" />
                <span>Restore</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {restore
                ? "This action cannot be undone. This will permanently delete the item and remove the data from our servers."
                : "this item will be move to trash you can permanently delete it from there "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={!restore ? MoveDocToTrash : handleDelete}
            >
              {restore ? "Delete" : "move to trash"}
            </AlertDialogAction>
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
