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
import { useState } from "react";
import Afs_Button from "./Loading-button";
import { useOrganization } from "@clerk/nextjs";
import { useToast } from "@afs/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  file: z.instanceof(File, {
    message: "choose a file",
  }),
});

export function UploadDoc() {
  const [isopen, setIsOpen] = useState(false);
  const {organization}  = useOrganization()
  const { toast } = useToast()

  const addDoc = useMutation(api.document.insertDocument);
  const getURL = useMutation(api.document.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const URL = await getURL();
      const result = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": values.file.type },
        body: values.file,
      });
      const { storageId } = await result.json();
      
      await addDoc({ name: values.name, fileId: storageId , orgId : organization?.id  });
      
      form.reset({ name: "" });
      setIsOpen(false);
      
      toast({
        variant : "success",
        title: "1 document has been upoaded",
        description: !organization ? "only you can see it" : `its visible to everyone on ${organization.name}`,
      })
    } catch (err) {
      toast({
        variant : "destructive",
        title: "somethig went wrong",
        description: "your file is not uploaded,try later",
      })

    }

  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isopen}>
      <DialogTrigger asChild>
        <Button>upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>upload profile</DialogTitle>
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
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>file</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldProps}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        onChange(file);
                      }}
                      // accept=".doc,.docx,.pdf,.xml,.csv,.txt,.json,.xlsx,.xls,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain,application/json"
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
