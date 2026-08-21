"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <AuthForm
      action={signup}
      title="Sign up"
      description="Create an account to get started"
      submitLabel="Sign up"
      loadingLabel="Creating account..."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    />
  );
}
