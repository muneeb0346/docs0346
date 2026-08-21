"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "@/app/actions/documents";
import { useRouter } from "next/navigation";
import { MoreVertical, Plus, FileText, Trash2 } from "lucide-react";
import { Document } from "@/lib/types/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load documents");
        toast.add({
          type: "error",
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load documents",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const handleNewDocument = async () => {
    const formData = new FormData();
    formData.append("title", "Untitled Document");

    try {
      await createDocument(formData);
    } catch (err) {
      toast.add({
        type: "error",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create document",
      });
    }
  };

  const handleRename = async () => {
    if (!renameId || !renameTitle.trim()) return;

    const formData = new FormData();
    formData.append("title", renameTitle.trim());

    try {
      await updateDocument(renameId, formData);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === renameId ? { ...doc, title: renameTitle.trim() } : doc))
      );
      setRenameId(null);
      setRenameTitle("");
      toast.add({
        type: "success",
        title: "Renamed",
        description: "Document renamed successfully.",
      });
    } catch (err) {
      toast.add({
        type: "error",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to rename document",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDocument(deleteId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== deleteId));
      setDeleteId(null);
      toast.add({
        type: "success",
        title: "Deleted",
        description: "Document deleted successfully.",
      });
    } catch (err) {
      toast.add({
        type: "error",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete document",
      });
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-destructive">Error</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Button onClick={handleNewDocument}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">No documents yet</p>
          <Button className="mt-4" onClick={handleNewDocument}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{doc.title || "Untitled Document"}</CardTitle>
                    <CardDescription>
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/document/${doc.id}`)}>
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameId(doc.id);
                          setRenameTitle(doc.title);
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(doc.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {extractPreview(doc.content)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/document/${doc.id}`)}
                >
                  Open Document
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={renameId !== null} onOpenChange={(open) => !open && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>Enter a new title for this document.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            placeholder="Document title"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function extractPreview(content: Record<string, unknown>): string {
  if (!content || typeof content !== "object") {
    return "Empty document";
  }

  const doc = content as { type?: string; content?: Array<Record<string, unknown>> };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) {
    return "Empty document";
  }

  function extractText(node: Record<string, unknown>): string {
    if (typeof node.text === "string") {
      return node.text;
    }

    if (Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }

    return "";
  }

  const text = doc.content.map(extractText).join(" ").replace(/\s+/g, " ").trim();

  return text.slice(0, 200) || "Empty document";
}
