"use client";

import { Button } from "@afs/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@afs/components/ui/card";
import { ArrowRight, ServerCrash, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@afs/components/ui/mode-toggle";

export default function EnhancedAuthPage() {
    const handleSignIn = () => {
      // Handle sign in logic here
      console.log("Navigating to sign in page")
    }
  
    const handleGuestContinue = () => {
      // Handle guest continuation logic here
      console.log("Continuing as guest")
    }

  return (
    <div className="flex flex-col items-center min-h-screen mt-4">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm  border-border/40">
      <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <ServerCrash className="w-6 h-6 mr-3" />
            <span className="font-bold">SavvyVault</span>
            <span className="sr-only">SavvyVault</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            >
              <Link href="https://github.com/salimi-my/shadcn-ui-sidebar">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
        </header>
        <div className="grow flex flex-col justify-center">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Sign in or continue as a guest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={handleSignIn}
            >
              <UserCircle2 className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button 
              className="w-full" 
              onClick={handleGuestContinue}
            >
              Continue as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
        </div>
    </div>
  );
}
