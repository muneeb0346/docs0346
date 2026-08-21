"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { DocumentInsert, DocumentUpdate } from "@/lib/types/supabase";

const createDocumentSchema = z.object({
  title: z.string().optional(),
});

const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

const documentIdSchema = z.object({
  id: z.string().uuid("Invalid document ID"),
});

export async function getDocuments() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getDocumentById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Document not found");
  }

  if (data.owner_id !== user.id) {
    throw new Error("Unauthorized");
  }

  return data;
}

export async function createDocument(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = createDocumentSchema.safeParse({
    title: formData.get("title"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const documentData: DocumentInsert = {
    owner_id: user.id,
    title: parsed.data.title || "Untitled Document",
    content: { type: "doc", content: [] },
  };

  const { data, error } = await supabase
    .from("documents")
    .insert(documentData)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/document/${data.id}`);
}

export async function updateDocument(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedId = documentIdSchema.safeParse({ id });
  if (!validatedId.success) {
    throw new Error("Invalid document ID");
  }

  const parsed = updateDocumentSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const updates: DocumentUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.title !== undefined) {
    updates.title = parsed.data.title;
  }

  if (parsed.data.content !== undefined) {
    try {
      updates.content = JSON.parse(parsed.data.content) as Record<
        string,
        unknown
      >;
    } catch {
      throw new Error("Invalid document content");
    }
  }

  const { error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedId = documentIdSchema.safeParse({ id });
  if (!validatedId.success) {
    throw new Error("Invalid document ID");
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
