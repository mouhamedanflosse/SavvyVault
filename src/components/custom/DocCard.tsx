'use client'

import { Button } from "@afs/components/ui/button";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@afs/components/ui/card";
import { Doc } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import OptionButton from "./OptionsButton";
import {fileTypes} from "@afs/lib/utils";
import { string } from "zod";
import Image from "next/image";
import { useEffect } from "react";


export function Document({ doc }: { doc: Doc<"docs"> }) {
  let FileIcon: string = ""; // Initialize with an empty string
  const icons = Object.keys(fileTypes);

  // Check document type against fileTypes
  for (const key of icons) {
    if (doc.type.includes(key)) {
      FileIcon = fileTypes[key]; // Assign the icon if a match is found
      break; // Exit loop on first match
    }
  }


  return (
    <Card className="md:min-w-[200px] min-w-[280px]">
      <CardHeader className="flex flex-row w-full justify-between items-center">
      <Image alt="file type" src={FileIcon} width={64} height={64} />
        {/* {fileTypes[doc.type]} */}
        <CardTitle>{doc.name}</CardTitle>
        <OptionButton doc={doc} />
      </CardHeader>
      <CardContent>
        <CardDescription>generic description by smart poeple</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button
          asChild
          className="w-full flex justify-center gap-2"
          variant="secondary"
        >
          <Link href={`/document/${doc._id}`}>
            <Eye className="text-base" />
            <span className="text-base">view</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
