import { getDocumentById } from "@/app/actions/documents";
import { redirect } from "next/navigation";
import { Editor } from "@/components/editor/editor";
import { Toaster } from "@/components/ui/toast";

export default async function DocumentPage({ params }: { params: { id: string } }) {
  let document;
  try {
    document = await getDocumentById(params.id);
  } catch {
    redirect("/dashboard");
  }

  return (
    <>
      <Editor
        documentId={document.id}
        initialTitle={document.title}
        initialContent={document.content as Record<string, unknown>}
      />
      <Toaster />
    </>
  );
}
