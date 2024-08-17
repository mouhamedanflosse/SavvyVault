import { cn } from "@afs/lib/utils"
import { ReactNode } from "react"

export default function MaxWidthWrapper({className,children} : {
    className? : string,
    children : ReactNode
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1424px] px-2.5 md:px-20", className)}>
      {children}
    </div>
  )
}
