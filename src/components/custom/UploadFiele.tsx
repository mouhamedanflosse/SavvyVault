"use client";
import { Button } from "@afs/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@afs/components/ui/dialog";
import { Input } from "@afs/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@afs/components/ui/form";
import React, { useState } from "react";
import Afs_Button from "./Loading-button";
import { useOrganization } from "@clerk/nextjs";
import { useToast } from "@afs/hooks/use-toast";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { FileUploader } from "./FileDropZone";
import { validateHeaderName } from "http";


export function UploadDoc({editMode,editing,setEditing , doc } : {editMode : boolean ,editing? : boolean , setEditing? : React.Dispatch<React.SetStateAction<boolean>> , doc? : Doc<"docs"> }) {


  const formSchema = z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    // file: z.array(!editMode ? z.instanceof(File) : )
    file: z
    .array(z.instanceof(File))
    .optional() // Makes the field optional
    .refine((file) => editMode || (file && file.length > 0), {
      message: "File is required.",
    }),
  });


  const [isopen, setIsOpen] = useState<boolean>(false);
  const {organization}  = useOrganization()
  const { toast } = useToast()

  const addDoc = useMutation(api.document.insertDocument);
  const editDoc = useMutation(api.document.editDocument);
  const getURL = useMutation(api.document.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:!editMode ? "" : doc?.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    if (!editMode) {
      console.log("inserting")
      try {
        const URL = await getURL();
        const result = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": values.file![0].type },
          body: values.file![0],
        });
        const { storageId } = await result.json();
        
        await addDoc({ name: values.name, fileId: storageId , orgId : organization?.id , type : values.file![0].type })
        
        form.reset({ name: "" });
        // fix it later
        // setEditing(prev => !prev)
        // setIsOpen(false)
        setIsOpen(false);
        
        toast({
        variant : "success",
        title: "1 document has been updated successfully",
        description: 'changes has been applied to this document',
      })
    } catch (err) {
      toast({
        variant : "destructive",
        title: "somethig went wrong",
        description: "your file is not uploaded,try later",
      })
      
    }
  } else {
    console.log("editing")
    let fileId ; 
    if (values.file?.length) {
      const URL = await getURL();
      const result = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": values.file[0].type },
        body: values.file[0],
      });
      const { storageId } = await result.json();
      fileId = storageId
    }
    
    // await editDoc({ {name: values.name, fileId: storageId} , orgId : organization?.id , docId });
    console.log(fileId)
    await editDoc({docId : doc?._id! , documentInfo : {name: values.name, fileId ,  type : values.file ? values.file[0].type : doc?.type! }, orgId : organization?.id  });
    
    form.reset({ name: "" });

    // @ts-ignore
    setEditing(false);
    
    toast({
    variant : "success",
    title: "1 document has been upoaded",
    description: !organization ? "only you can see it" : `its visible to everyone on ${organization.name}`,
  })

  }

  }

  return (
    <Dialog onOpenChange={!editMode ? setIsOpen : setEditing} open={ !editMode ? isopen : editing}>
      {!editMode ? <DialogTrigger asChild>
        <Button>upload</Button>
      </DialogTrigger>
      : ""}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "edit document" : "upload document" }</DialogTitle>
          <DialogDescription>
            document description will generated automatically
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    <FormMessage />
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>file</FormLabel>
                  <FormControl>
                    <FileUploader  
                    // @ts-ignore
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFileCount={1}
                    maxSize={4 * 1024 * 1024}
                    // progresses={progresses}
                    disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    <FormMessage />
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Afs_Button
                label="submit"
                loading={form.formState.isSubmitting}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
