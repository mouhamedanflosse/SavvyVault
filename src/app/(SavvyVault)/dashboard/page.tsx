"use client";

import { useOrganization } from "@clerk/nextjs";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadDoc } from "@afs/components/custom/UploadFiele";
import Lottie from "lottie-react";
import orange_sleepy_cat from "../../../../public/assets/orange_sleepy_cat.json";
import { Document } from "@afs/components/custom/DocCard";
import { Loader2 } from "lucide-react";
import SearchBar from "@afs/components/custom/SearchBar";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ContentLayout } from "@afs/components/custom/admin-panel/content-layout";

function App() {
  const { organization } = useOrganization();
  const [query, setQuery] = useState<string | null>(null);

  const { userId } = useAuth();
  const Docs = useQuery(api.document.getDocuments, {
    orgId: organization?.id,
    query: !query ? "" : query,
  });

  return (
    <ContentLayout title="dashboard">
      {Docs == undefined && userId == undefined ? (
        <Loader2 className="mx-auto mt-36 h-20 w-20 animate-spin text-3xl" />
      ) : (
        <main className="flex min-h-screen flex-col items-center gap-14">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl">
              {!organization
                ? "your documents"
                : `${organization.name}'s documents`}
            </h1>
            <Authenticated>
              <UploadDoc editMode={false} />
            </Authenticated>
          </div>
          <div className="flex w-full justify-end">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          {Docs && Docs.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* use length to handl empty docs page , and null to handl loading */}
              {/* rememberalso fix the mobile view  */}
              {Docs?.map((doc: any) => {
                return <Document key={doc._id} doc={doc} />;
              })}
            </div>
          ) : Docs && !Docs.length ? (
            <div>
              <Lottie
                animationData={orange_sleepy_cat}
                loop={true}
                className="mx-auto w-36"
              />
            </div>
          ) : (
            <Loader2 className="mx-auto mt-20 h-20 w-20 animate-spin text-3xl" />
          )}
        </main>
      )}
    </ContentLayout>
  );
}

export default App;
