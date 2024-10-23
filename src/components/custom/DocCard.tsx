import * as React from "react";

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

export function Document({ doc }: { doc: Doc<"docs"> }) {
  return (
    <Card className="md:min-w-[200px] min-w-[280px]">
      <CardHeader className="flex flex-row w-full justify-between items-center">
        <CardTitle>{doc.name}</CardTitle>
        <OptionButton />
      </CardHeader>
      <CardContent>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
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
