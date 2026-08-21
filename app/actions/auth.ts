"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(formData: FormData) {
  const { success, data, error } = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!success) {
    return { error: error.issues[0].message };
  }

  const supabase = await createClient();

  const { error: signupError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signupError) {
    return { error: signupError.message };
  }

  redirect("/dashboard");
}

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signin(formData: FormData) {
  const { success, data, error } = signinSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!success) {
    return { error: error.issues[0].message };
  }

  const supabase = await createClient();

  const { error: signinError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (signinError) {
    return { error: signinError.message };
  }

  redirect("/dashboard");
}
