// pages/sso-callback.tsx
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  console.log("SSO Callback page loaded");
  return <AuthenticateWithRedirectCallback />;
}
