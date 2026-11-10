import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the text is still on screen to select by hand.
    }
  };

  return (
    <button
      type="button"
      onClick={copyText}
      aria-label={copied ? "Copied" : label}
      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
