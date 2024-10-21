"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import ChatBox from "./Chat-box";
import { useOrganization } from "@clerk/nextjs";

export default function Document({
  params,
}: {
  params: {
    docID: Id<"docs">;
  };
}) {
  const { organization } = useOrganization();

  const doc = useQuery(api.document.getDocument, {
    docId: params.docID,
    orgId: organization?.id,
  });

  if (!doc) {
    return (
      <h1 className="mt-32 text-center text-lg">
        You cannot view this content in
        {!organization
          ? "personal mode. Please switch to the correct organization."
          : "this organization. Please switch to the correct organization or your personal account."}
      </h1>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-start">
          <h1>{doc.name}</h1>
        </div>
        <div className="flex w-full gap-6">
          <ScrollArea className="h-[500px] w-1/2 overflow-scroll rounded-md border bg-gray-900 p-4">
            {doc.docURL && (
              <iframe className="block h-[500px] w-full" src={doc.docURL} />
            )}
          </ScrollArea>
          <ChatBox docId={params.docID} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
