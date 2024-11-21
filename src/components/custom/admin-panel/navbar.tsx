import AuthHeader from "@afs/app/Auth-header";
import { SheetMenu } from "@afs/components/custom/admin-panel/sheet-menu";
import { ModeToggle } from "@afs/components/ui/mode-toggle";
import { OrganizationSwitcher } from "@clerk/nextjs";
import CustomOrganizationSwitcher from "../custom-organization-switcher";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {/* <ModeToggle /> */}
          {/* <UserNav /> */}
          <div className="flex items-center gap-4">
            <OrganizationSwitcher />
            <CustomOrganizationSwitcher />
            <AuthHeader />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
