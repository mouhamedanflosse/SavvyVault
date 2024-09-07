"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import ChatBox from "./Chat-box";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@afs/components/ui/form";
import { Input } from "@afs/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@afs/components/ui/button";

export default function Document({
  params,
}: {
  params: {
    docID: Id<"docs">;
  };
}) {
  const doc = useQuery(api.document.getDocument, {
    docId: params.docID,
  });

  //  validating the form
  const formSchema = z.object({
    message: z.string().min(2, { message: "please type something" }),
  });

  const formdata = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  if (!doc) {
    return (
      <h1 className="mt-32 text-center text-lg">
        {" "}
        you dont have access to that document.
      </h1>
    );
  }

  function handleSubmit() {}

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-start">
          <h1>{doc.name}</h1>
        </div>
        <div className="flex w-full gap-6">
          <ScrollArea className="h-[500px] w-1/2 overflow-scroll rounded-md border bg-gray-900 p-4">
            {doc.docURL && (
              <iframe className="block h-[500px] w-full" src={doc.docURL} />
            )}
          </ScrollArea>
          <div className="flex h-[500px] w-1/2 flex-col rounded-md border bg-gray-900 p-4">
            <ChatBox />
            <div className="flex max-h-16 w-full items-center gap-x-4">
              <Form {...formdata}>
                <form
                  onSubmit={formdata.handleSubmit(handleSubmit)}
                  className="w-full"
                >
                  <FormField
                    control={formdata.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Username</FormLabel> */}
                        <FormDescription>
                          {/* This is your public display name. */}
                          <FormMessage className="text-red-400" />
                        </FormDescription>
                        <FormControl className="rounded-md px-3 py-7">
                          <Input
                            placeholder="Ask Question"
                            className=""
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Button>submit</Button>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
