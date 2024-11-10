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
import { ArrowRight, Loader2, ServerCrash, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@afs/components/ui/mode-toggle";
import { SignInButton, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnhancedAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, setActive, isLoaded, } = useSignIn();

  const handleSignIn = async () => {
    const result = await signIn?.authenticateWithRedirect({  strategy: "oauth_google", // or "oauth_github", "oauth_facebook", etc.
      redirectUrl: `${window.location.origin}/sso-callback`,
      redirectUrlComplete: "/dashboard"})
    console.log("Navigating to sign in page");
  };

  const handleGuestContinue = async () => {
    console.log("sign in ");
    try {
      if (!isLoaded) return;

      setIsLoading(true);
      const result = await signIn.create({
        password: process.env.NEXT_PUBLIC_GUEST_PASSWORD as string,
        identifier: process.env.NEXT_PUBLIC_GUEST_EMAILADDRESS as string,
      });

      console.log({
        password: process.env.GUEST_PASSWORD as string,
        identifier: process.env.GUEST_EMAILADDRESS as string,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setIsLoading(false);
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        console.error("Sign in failed", result);
        // setError("Sign in failed. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    console.log("Continuing as guest");
  };

  return (
    <div className="mt-4 flex min-h-screen flex-col items-center">
      <header className="sticky top-0 z-[50] w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <ServerCrash className="mr-3 h-6 w-6" />
            <span className="font-bold">SavvyVault</span>
            <span className="sr-only">SavvyVault</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background"
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
      <div className="flex grow flex-col justify-center">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Sign in or continue as a guest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <SignInButton> */}
              <Button
                className="w-full"
                variant="outline"
                onClick={handleSignIn}
              >
                <UserCircle2 className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            {/* </SignInButton> */}
            <Button className="w-full" onClick={handleGuestContinue}>
              {!isLoading ? <>
              Continue as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
              </>
              : <Loader2 className="animate-spin w-6 h-6" />
              }
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
