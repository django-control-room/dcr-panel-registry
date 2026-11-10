import { Head } from "vite-react-ssg";

type SeoProps = {
  title: string;
  description?: string;
};

// Rendered into each page's static HTML at build time, so crawlers see it without running JS.
export default function Seo({ title, description }: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
    </Head>
  );
}
