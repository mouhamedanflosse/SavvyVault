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
import { useState } from "react";

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function ChatBox({
  docId,
}: {
  docId: Id<"docs">
}) {

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
  ])
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
    const input = formdata.getValues("message").trim()
      if (input) {
        // Add user message
        const userMessage: Message = { id: messages.length + 1, text: input, sender: 'user' }
        setMessages((prevMessages : Message[]) => [...prevMessages, userMessage])
  
        // Simulate bot response (you can replace this with actual chatbot logic)
        setTimeout(() => {
          const botMessage: Message = { id: messages.length + 2, text: "Thank you for your message. I'm a demo chatbot, so I don't have real responses yet.", sender: 'bot' }
          setMessages((prevMessages : Message[]) => [...prevMessages, botMessage])
        }, 1000)
  
        formdata.reset({message : ''})
      }
  }

  return (
    <div className="flex h-[500px] w-1/2 flex-col justify-between rounded-md border bg-gray-900 p-4">
      <ScrollArea className="mb-4 flex w-full flex-col  gap-3 grow">
      {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
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
