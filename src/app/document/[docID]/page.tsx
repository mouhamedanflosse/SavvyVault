"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import ChatBox from "./Chat-box";

export default function Document({
  params,
}: {
  params: {
    docID: Id<"docs">;
  };
}) {
  const doc = useQuery(api.document.getDocument, {
    docId: params.docID,
  });

  if (!doc) {
    return (
      <h1 className="mt-32 text-center text-lg">
        {" "}
        you dont have access to that document.
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
          <ChatBox docId={params.docID}/>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
