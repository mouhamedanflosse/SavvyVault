"use client";
import { useOrganization } from "@clerk/nextjs";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { UploadDoc } from "@afs/components/custom/UploadFiele";
import Lottie from "lottie-react";
import sleepyCat from "../../public/assets/sleepy_cat.json";
import sleepy_raccoon from "../../public/assets/sleepy_raccoon.json";
import orange_sleepy_cat from "../../public/assets/orange_sleepy_cat.json";
import { Document } from "@afs/components/custom/DocCard";
import { Loader2 } from "lucide-react";

function App() {
  const { organization } = useOrganization();
  const Docs = useQuery(api.document.getDocuments, { orgId: organization?.id });

  return (
    <MaxWidthWrapper>{ Docs == undefined ?  <Loader2 className="animate-spin text-3xl w-20 h-20 mx-auto mt-36" /> :
      <main className="flex min-h-screen flex-col items-center gap-14 p-24">
        <div className="flex w-full justify-end">
          <Authenticated>
            <UploadDoc editMode={false} />
          </Authenticated>
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
      </main>}
    </MaxWidthWrapper>
  );
}

export default App;
