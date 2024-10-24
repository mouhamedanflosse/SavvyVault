'use client'
import {  useOrganization } from "@clerk/nextjs";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { Document } from "@afs/components/custom/DocCard";
import { UploadDoc } from "@afs/components/custom/UploadFiele";

function App() {

  const {organization} = useOrganization()
  const Docs = useQuery(api.document.getDocuments , {orgId : organization?.id } )

  
  return (
    <MaxWidthWrapper>
    <main className="flex min-h-screen flex-col items-center gap-14 p-24">
    <div className="flex justify-end w-full">
      <Authenticated>
        <UploadDoc editMode={false} />
      </Authenticated>
    </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
      {
        Docs?.map((doc : any) => {
          return <Document key={doc._id} doc={doc} />
        })
      }
      </div>
    </main>
    </MaxWidthWrapper>
  );
}

export default App;
