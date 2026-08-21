"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthFormAction = (formData: FormData) => Promise<{ error?: string } | void>;

interface AuthFormProps {
  action: AuthFormAction;
  title: string;
  description: string;
  submitLabel: string;
  loadingLabel: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthForm({
  action,
  title,
  description,
  submitLabel,
  loadingLabel,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? loadingLabel : submitLabel}
            </Button>
            <p className="text-sm text-muted-foreground">
              {footerText}{" "}
              <a href={footerLinkHref} className="text-primary underline">
                {footerLinkText}
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
