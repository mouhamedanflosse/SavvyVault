'use client'
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { Button } from "../../@/components/ui/button";
import { api } from "../../convex/_generated/api";

function App() {

  const addDoc = useMutation(api.document.insertDocument)

  
  return (
    <main className="flex dark min-h-screen flex-col items-center gap-14 p-24">
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Authenticated>
        <Button variant="default"  onClick={() => addDoc({text : "let's Goooo afs"})}>add doc</Button>
      </Authenticated>
    </main>
  );
}

export default App;
