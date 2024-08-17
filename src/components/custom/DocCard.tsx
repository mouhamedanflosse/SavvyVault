import * as React from "react"

import { Button } from "@afs/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@afs/components/ui/card"
import {Doc } from'../../../convex/_generated/dataModel'

export function Document({doc} : {doc : Doc<'docs'>}) {
  return (
    <Card className="md:min-w-[200px] min-w-[280px]">
      <CardHeader>
        <CardTitle>{doc.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button className="w-full" variant="secondary">View</Button>
      </CardFooter>
    </Card>
  )
}
