"use client";

import { ModeToggle } from "@afs/components/ui/mode-toggle";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-between p-7">
      <div className="text-2xl">SavvyVault</div>
      <div className="flex gap-4 items-center">
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
        <ModeToggle />
      </div>
    </div>
  );
}
