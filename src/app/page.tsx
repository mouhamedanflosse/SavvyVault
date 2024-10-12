'use client'
import { SignInButton, useOrganization, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { Button } from "@afs/components/ui/button";
import { api } from "../../convex/_generated/api";
import { ModeToggle } from "@afs/components/ui/mode-toggle";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import Header from "./Header";
import { Document } from "@afs/components/custom/DocCard";
import { UploadDoc } from "@afs/components/custom/UploadFiele";

function App() {

  const {organization} = useOrganization()
  const addDoc = useMutation(api.document.insertDocument)
  // const Docs = useQuery(api.document.getDocuments ,organization?.id!)

  
  return (
    <MaxWidthWrapper>
    <main className="flex min-h-screen flex-col items-center gap-14 p-24">
    <div className="flex justify-end w-full">
      <Authenticated>
        <UploadDoc />
      </Authenticated>
    </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
      {/* {
        Docs?.map((doc : any) => {
          // console.log(doc, Docs)
          return <Document key={doc._id} doc={doc} />
        })
      } */}
      </div>
    </main>
    </MaxWidthWrapper>
  );
}

export default App;
