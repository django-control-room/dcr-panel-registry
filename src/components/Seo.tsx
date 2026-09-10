import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
};

function setMeta(selector: string, attr: "content", value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [kind, name] = selector.match(/\[(name|property)="([^"]+)"\]/) ?? [];
    if (!kind || !name) return;
    el.setAttribute(kind, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", description);
    }
  }, [title, description]);

  return null;
}
