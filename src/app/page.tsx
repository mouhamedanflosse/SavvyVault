"use client";
import { useOrganization } from "@clerk/nextjs";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { UploadDoc } from "@afs/components/custom/UploadFiele";
import Lottie from "lottie-react";
import orange_sleepy_cat from "../../public/assets/orange_sleepy_cat.json";
import { Document } from "@afs/components/custom/DocCard";
import { Loader2 } from "lucide-react";
import SearchBar from "@afs/components/custom/SearchBar";

function App() {
  const { organization } = useOrganization();
  const Docs = useQuery(api.document.getDocuments, { orgId: organization?.id });

  return (
    <MaxWidthWrapper>
      {Docs == undefined ? (
        <Loader2 className="mx-auto mt-36 h-20 w-20 animate-spin text-3xl" />
      ) : (
        <main className="flex min-h-screen flex-col items-center gap-14 p-24">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl">
              { !organization ?
             'your documents'
              : `${organization.name}'s documents`
              }
               </h1>
            <Authenticated>
              <UploadDoc editMode={false} />
            </Authenticated>
          </div>
            <div className="w-full flex justify-end">
              <SearchBar />
            </div>

          {Docs.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* use length to handl empty docs page , and null to handl loading */}
              {/* rememberalso fix the mobile view  */}
              {Docs?.map((doc: any) => {
                return <Document key={doc._id} doc={doc} />;
              })}
            </div>
          ) : (
            <div>
              <Lottie
                animationData={orange_sleepy_cat}
                loop={true}
                className="mx-auto w-36"
              />
            </div>
          )}
        </main>
      )}
    </MaxWidthWrapper>
  );
}

export default App;
