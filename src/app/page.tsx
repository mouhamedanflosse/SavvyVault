'use client'
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { Button } from "@afs/components/ui/button";
import { api } from "../../convex/_generated/api";
import { ModeToggle } from "@afs/components/ui/mode-toggle";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import Header from "./Header";

function App() {

  const addDoc = useMutation(api.document.insertDocument)
  const Docs = useQuery(api.document.getDocuments)

  
  return (
    <MaxWidthWrapper>
    <Header />
    <main className="flex min-h-screen flex-col items-center gap-14 p-24">
      
      <Authenticated>
        <Button  onClick={() => addDoc({text : "let's Goooo afs"})}>add doc</Button>
      </Authenticated>
      {
        Docs?.map((doc : any) => {
          // console.log(doc, Docs)
          return <p key={doc._id}>{doc.name}</p>
        })
      }
    </main>
    </MaxWidthWrapper>
  );
}

export default App;
