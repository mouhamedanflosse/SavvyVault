"use client";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@afs/components/ui/form";
import { Input } from "@afs/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@afs/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function ChatBox({
  docId,
}: {
  docId: Id<"docs">
}) {
  // const askQuestion = useAction(api.document.askQuestion);

  //  validating the form
  const formSchema = z.object({
    message: z.string().min(2, { message: "please type something" }),
  });

  const formdata = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function handleSubmit() {
    // await askQuestion({
    //   docId : docId,
    //   question : formdata.getValues("message")
    // });
  }

  return (
    <div className="flex h-[500px] w-1/2 flex-col justify-between rounded-md border bg-gray-900 p-4">
      <ScrollArea className="mb-4 flex w-full flex-col  gap-3 grow">
       
        <h1>hello world</h1>
        <h1>hello world</h1>
        <h1>hello world</h1>
      </ScrollArea>
      <div className="flex max-h-16 w-full items-center gap-x-4 mb-2">
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
                    <Input placeholder="Ask Question" className="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button>submit</Button>
      </div>
    </div>
  );
}
