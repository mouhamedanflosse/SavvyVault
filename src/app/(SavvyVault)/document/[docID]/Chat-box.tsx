"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import {
  Form,
  FormControl,
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
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const formSchema = z.object({
  message: z.string().min(1, { message: "Please type a message" }),
});

export default function ChatBox({
  docId,
}: {
  docId: Id<"docs">
}) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const input = values.message.trim();
    if (input) {
      const userMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Simulate bot response (replace this with actual chatbot logic)
      setTimeout(() => {
        const botMessage: Message = { 
          id: messages.length + 2, 
          text: "Thank you for your message. I'm a demo chatbot, so I don't have real responses yet.", 
          sender: 'bot' 
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 1000);

      form.reset();
    }
  }

  return (
    <div className="flex h-[500px] w-full max-w-2xl flex-col justify-between rounded-lg border bg-background shadow-lg">
      <div className="bg-primary p-4">
        <h2 className="text-2xl font-bold text-primary-foreground">Chat Assistant</h2>
      </div>
      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input 
                      placeholder="Type your message..." 
                      {...field} 
                      className="w-full"
                      aria-label="Chat message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}