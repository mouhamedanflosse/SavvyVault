'use client'
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
import MobileChatBotLayout from "@afs/components/custom/MobileChatBotLayout";
import { getPlaiceholder } from "plaiceholder";


export default  function Document({
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


  // const {
  //   metadata: { height, width },
  //   ...plaiceholder
  // } =  getPlaiceholder(Buffer.from(doc?.docURL),{size : 10});

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
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-bold">{doc.name}</h1>
            {/* <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
              <DialogTrigger asChild>
                <Button className="lg:hidden" variant="outline" size="icon">
                  <MessageCircle className="h-6 w-6" />
                  <span className="sr-only">Open chat</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[calc(100vh-2rem)] p-0 sm:max-w-[425px]">
                <DialogHeader className="px-4 py-2">
                  <DialogTitle>Chat</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <ChatBox docId={params.docID} />
                </div>
              </DialogContent>
            </Dialog> */}
            <MobileChatBotLayout docId={params.docID} />
          </div>
          <div className="relative flex w-full flex-col gap-6 lg:flex-row">
            <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border bg-gray-900 lg:w-1/2">
              {doc.docURL && (
                <iframe
                  className="h-[calc(100vh-12rem)] w-full"
                  src={doc.docURL}
                  title={`Document: ${doc.name}`}
                />
              )}
            </ScrollArea>
            <div className="hidden h-[calc(100vh-12rem)] w-full lg:block lg:w-1/2">
              <ChatBox docId={params.docID} />
            </div>
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
