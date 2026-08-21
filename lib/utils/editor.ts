export function extractPlainTextFromTiptapJson(
  content: Record<string, unknown>,
): string {
  if (!content || typeof content !== "object") {
    return "";
  }

  const doc = content as {
    type?: string;
    content?: Array<Record<string, unknown>>;
  };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) {
    return "";
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

  const text = doc.content.map(extractText).join(" ");

  const normalized = text.replace(/\s+/g, " ").trim();

  return normalized.slice(0, 200);
}
