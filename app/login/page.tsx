"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { signin } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <AuthForm
      action={signin}
      title="Login"
      description="Enter your credentials to access your account"
      submitLabel="Sign in"
      loadingLabel="Signing in..."
      footerText="Don&apos;t have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    />
  );
}
