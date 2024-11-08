"use client";

import { useOrganization } from "@clerk/nextjs";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadDoc } from "@afs/components/custom/UploadFiele";
import Lottie from "lottie-react";
import orange_sleepy_cat from "../../../assets/orange_sleepy_cat.json";
import { Document } from "@afs/components/custom/DocCard";
import { Loader2 } from "lucide-react";
import SearchBar from "@afs/components/custom/SearchBar";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@afs/components/ui/breadcrumb";
import { ContentLayout } from "@afs/components/custom/admin-panel/content-layout";
import Link from "next/link";
import { Doc } from "../../../../convex/_generated/dataModel";

export default function SavedDocuments() {
  const { organization } = useOrganization();
  const [query, setQuery] = useState<string | null>(null);

  const { userId } = useAuth();
  const Docs = useQuery(api.document.getsavedDocuments, {
    orgId: organization?.id,
    query: !query ? "" : query,
  });
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
            <BreadcrumbPage>saved</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {Docs == undefined && userId == undefined ? (
        <Loader2 className="mx-auto mt-36 h-20 w-20 animate-spin text-3xl" />
      ) : (
        <main className="flex min-h-screen flex-col items-center gap-14 pt-4">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl">
              {!organization
                ? "your documents"
                : `${organization.name}'s documents`}
            </h1>
            {/* <Authenticated>
              <UploadDoc editMode={false} />
            </Authenticated> */}
          </div>
          <div className="flex w-full justify-end">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          {Docs && Docs.docs?.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* use length to handl empty docs page , and null to handl loading */}
              {/* rememberalso fix the mobile view  */}
              {Docs?.docs?.map((doc: Doc<"docs">) => {
                return <Document key={doc._id} user={Docs.user} saved={Docs.user?.saved && Docs.user.saved.some((id) => id == doc._id ) ? true : false} doc={doc} />;
              })}
            </div>
          ) : Docs && !Docs.docs?.length ? (
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
