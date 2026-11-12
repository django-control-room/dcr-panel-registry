import { Head } from "vite-react-ssg";

const SITE_ORIGIN = "https://djangocontrolroom.com";
const DEFAULT_IMAGE = `${SITE_ORIGIN}${import.meta.env.BASE_URL}og-image.png`;

type SeoProps = {
  title: string;
  description?: string;
  /** A site path such as a built screenshot URL; defaults to the shared social image. */
  image?: string | undefined;
};

// Rendered into each page's static HTML at build time, so crawlers see it without running JS.
export default function Seo({ title, description, image }: SeoProps) {
  const imageUrl = image ? `${SITE_ORIGIN}${image}` : DEFAULT_IMAGE;
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
