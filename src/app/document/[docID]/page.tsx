"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { ScrollArea } from "@afs/components/ui/scroll-area";

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
      <h1 className="text-center mt-32 text-lg">
        {" "}
        you dont have access to that document.
      </h1>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-start w-full">
          <h1>{doc.name}</h1>
        </div>
        <div className="flex w-full  gap-6">
            <ScrollArea className="w-1/2 h-96 overflow-scroll rounded-md border">
            <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[500px] ">
                  {doc.docURL && (
                    <iframe
                      className="w-full h-full"
                      src={doc.docURL}
                    />
                  )}
                </div>
            </ScrollArea>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
