"use client";

import { ModeToggle } from "@afs/components/ui/mode-toggle";
import AuthHeader from "./Auth-header";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";

export default function Header() {
  return (
    <MaxWidthWrapper>
    <div className="w-full flex items-center justify-between p-7">
      <div className="text-2xl">SavvyVault</div>
      <div className="flex gap-4 items-center">
        <AuthHeader />
        <ModeToggle />
      </div>
    </div>
    </MaxWidthWrapper>
  );
}
