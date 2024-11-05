
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

export function Document({
  doc,
  saved,
  user,
  restore,
}: {
  doc: Doc<"docs">;
  saved: boolean;
  user: Doc<"users"> | null;
  restore?: boolean;
}) {
  let FileIcon: string = "";
  const icons = Object.keys(fileTypes);

  // Check document type against fileTypes
  for (const key of icons) {
    if (doc.type.includes(key)) {
      FileIcon = fileTypes[key];
      break;
    }
  }

  console.log(user);

  return (
    <Card className="min-w-[280px] md:min-w-[200px]">
      <CardHeader className="relative flex w-full flex-row items-center justify-between">
        {/* <Image alt="file type" src={FileIcon} width={64} height={64} /> */}
        {/* <iframe src={fileTypes[doc.type]} ></iframe> */}
        {/* {fileTypes[doc.type]} */}
        {/* <div className="absolute right-0 top-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {FileIcon ? (
                  <div
                    className="h-10 w-10 cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: FileIcon }} // Render SVG directly
                    // style={{ width: '44px', height: '44px' }} // Set dimensions here if needed
                  />
                ) : doc.type.includes("image") ? (
                  <div
                    className="h-10 w-10 cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: fileTypes["image/*"] }} // Render SVG directly
                    // style={{ width: '44px', height: '44px' }} // Set dimensions here if needed
                  />
                ) : (
                  ""
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{doc.type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div> */}

        <CardTitle>{doc.name}</CardTitle>
        <OptionButton restore={restore} user={user} saved={saved} doc={doc} />
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto flex h-14 w-10/12 items-center justify-center">
          {doc.type.includes("image") ? (
            <Image
              alt="image file"
              // placeholder="blur"
              className="absolute mx-auto rounded-md"
              fill={true}
              src={doc.docUrl}
            />
          ) : (
            // <Paperclip className="mx-auto w-10" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-10 w-10 cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: FileIcon }} // Render SVG directly
                    // style={{ width: '44px', height: '44px' }} // Set dimensions here if needed
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{doc.type}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {/* <CardDescription>generic description by smart poeple</CardDescription> */}
      </CardContent>
      <CardFooter className="justify-between gap-2 px-2">
        <div className="flex grow justify-center">
          <Button
            asChild
            className="flex w-full justify-center gap-2"
            variant="secondary"
          >
            <Link href={`/document/${doc._id}`}>
              <Eye className="text-base" />
              <span className="text-base">Explore</span>
            </Link>
          </Button>
        </div>
        {user && (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* <Button variant="outline">Hover</Button> */}
                  <Image
                    alt="author"
                    width={24}
                    height={24}
                    className="cursor-pointer rounded-full border-2 border-transparent ring-2 ring-green-300 "
                    src={user.image}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <span>{user.name}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
