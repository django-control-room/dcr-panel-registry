import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
};

function setMeta(kind: "name" | "property", name: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(kind, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:title", title);
      setMeta("property", "og:description", description);
    }
  }, [title, description]);

  return null;
}
