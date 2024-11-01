"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ScrollArea } from "@afs/components/ui/scroll-area";
import ChatBox from "./Chat-box";
import { useOrganization } from "@clerk/nextjs";
import { ContentLayout } from "@afs/components/custom/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@afs/components/ui/breadcrumb";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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

  // if (!doc) {
  //   return (
  //     <ContentLayout title="restricted">
  //       <Breadcrumb>
  //         <BreadcrumbList>
  //           <BreadcrumbItem>
  //             <BreadcrumbLink asChild>
  //               <Link href="/">Home</Link>
  //             </BreadcrumbLink>
  //           </BreadcrumbItem>
  //           <BreadcrumbSeparator />
  //           <BreadcrumbItem>
  //             <BreadcrumbLink asChild>
  //               <Link href="/dashboard">Dashboard</Link>
  //             </BreadcrumbLink>
  //           </BreadcrumbItem>
  //           <BreadcrumbSeparator />
  //         </BreadcrumbList>
  //       </Breadcrumb>
  //       <h1 className="mt-32 text-center text-lg">
  //         You cannot view this content in
  //         {!organization
  //           ? "personal mode. Please switch to the correct organization."
  //           : "this organization. Please switch to the correct organization or your personal account."}
  //       </h1>
  //     </ContentLayout>
  //   );
  // }

  return (
    <ContentLayout title="dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{doc?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {doc == undefined ? (
        <Loader2 className="mx-auto mt-36 h-20 w-20 animate-spin text-3xl" />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
        <div className="flex w-full justify-start">
          <h1 className="text-2xl font-bold">{doc.name}</h1>
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <ScrollArea className="h-[500px] lg:h-[600px] w-full lg:w-1/2 rounded-md border bg-gray-900 p-4">
            {doc.docURL && (
              <iframe 
                className="w-full h-full" 
                src={doc.docURL}
                title={`Document: ${doc.name}`}
              />
            )}
          </ScrollArea>
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <ChatBox docId={params.docID} />
          </div>
        </div>
      </div>
      )}
    </ContentLayout>
  );
}
