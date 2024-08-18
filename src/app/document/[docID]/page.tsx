'use client'
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";

export default function document({
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
    return <h1 className="text-center mt-32 text-lg"> you dont have access to that document.</h1>;
  }

  return (
    <MaxWidthWrapper>

    <div>
      <div className="flex justify-start w-full">
        <h1>{doc.name}</h1>
      </div>
    </div>
    </MaxWidthWrapper>
  );
}
