"use client";

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
import { fileTypes } from "@afs/lib/utils";
import { string } from "zod";
import Image from "next/image";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@afs/components/ui/tooltip";
import { Paperclip } from 'lucide-react';

export function Document({ doc, saved, user }: { doc: Doc<"docs"> , saved : boolean ,user : Doc<"users"> | null }) {
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
    <Card className="min-w-[280px] md:min-w-[200px]">
      <CardHeader className="relative flex w-full flex-row items-center justify-between">
        {/* <Image alt="file type" src={FileIcon} width={64} height={64} /> */}
        {/* <iframe src={fileTypes[doc.type]} ></iframe> */}
        {/* {fileTypes[doc.type]} */}
        <div className="absolute right-0 top-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                { FileIcon ?
                <div
                  className="h-10 w-10 cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: FileIcon }} // Render SVG directly
                  // style={{ width: '44px', height: '44px' }} // Set dimensions here if needed
                /> : doc.type.includes("image") ? <div
                className="h-10 w-10 cursor-pointer"
                dangerouslySetInnerHTML={{ __html: fileTypes['image/*'] }} // Render SVG directly
                // style={{ width: '44px', height: '44px' }} // Set dimensions here if needed
              /> : ""}
              </TooltipTrigger>
              <TooltipContent>
                <p>{doc.type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CardTitle>{doc.name}</CardTitle>
        <OptionButton user={user} saved={saved} doc={doc} />
      </CardHeader>
      <CardContent>
        <div className="relative w-10/12 h-14 flex justify-center items-center mx-auto">

        { 
        doc.type.includes("image") ?
        <Image alt="image file" className="absolute mx-auto rounded-md " fill={true} src={doc.docUrl
        } />
        : <Paperclip className="w-10 mx-auto" />
      }
      </div>
        {/* <CardDescription>generic description by smart poeple</CardDescription> */}
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button
          asChild
          className="flex w-full justify-center gap-2"
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
