'use client'
import React from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@afs/components/theme-provider"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export default function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </ThemeProvider>
      
  )
}
