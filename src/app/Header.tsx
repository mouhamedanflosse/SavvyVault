"use client";

import { ModeToggle } from "@afs/components/ui/mode-toggle";
import AuthHeader from "./Auth-header";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Link from 'next/link'

export default function Header() {
  return (
    <MaxWidthWrapper>
    <div className="w-full flex items-center justify-between p-7">
      <Link href="/" className="text-2xl">SavvyVault</Link>
      <div className="flex gap-4 items-center">
        <OrganizationSwitcher />
        <AuthHeader />
        <ModeToggle />
      </div>
    </div>
    </MaxWidthWrapper>
  );
}
