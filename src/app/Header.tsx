"use client";

import { ModeToggle } from "@afs/components/ui/mode-toggle";
import AuthHeader from "./Auth-header";
import MaxWidthWrapper from "@afs/components/ui/MaxWithWrapper";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Link from 'next/link'
import CustomOrganizationSwitcher from "@afs/components/custom/custom-organization-switcher";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-between p-7">
      <Link href="/" className="text-2xl">SavvyVault</Link>
      <div className="flex gap-4 items-center">
        <OrganizationSwitcher />
        {/* <CustomOrganizationSwitcher /> */}
        <AuthHeader />
        <ModeToggle />
      </div>
    </div>
  );
}
