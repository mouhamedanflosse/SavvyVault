'use client'

import { useState } from 'react'
import { Button } from "@afs/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@afs/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@afs/components/ui/alert-dialog"
import { MoreVertical, Trash } from 'lucide-react'
import { useOrganization } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { toast } from '@afs/hooks/use-toast'

export default function OptionButton({ docId }: {docId : Id<"docs">} ) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const {organization} = useOrganization()
  const deleteDoc = useMutation(api.document.deleteDocument)

  const handleDelete = () => {
    // Implement your delete logic here
    try {
      console.log({docId : docId , orgId : organization?.id})
      deleteDoc({docId : docId , orgId : organization?.id})
      console.log("Item deleted")
      setShowDeleteDialog(false)
      // alert 
      toast({
        variant : "success",
        title: "1 document deleted successfully",
        description: organization ? `1 document deleted from ${organization.name}` : "1 document deleted from your personal space",
      })
    } catch (err) {
      console.log(err)
      toast({
        variant : "destructive",
        title: "somethig went wrong",
        description: "you can't perfom this action",
      })
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}