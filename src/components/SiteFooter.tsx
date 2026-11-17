import { DISCORD_URL } from "@/lib/links";

const MAIN_SITE = "https://djangocontrolroom.com";

// Keep in sync with dj-control-room-website/src/components/Footer.tsx so both sites match.
const columns = [
  {
    title: "Product",
    links: [
      { label: "Docs", href: "https://django-control-room.github.io/dj-control-room/" },
      { label: "Panels", href: `${MAIN_SITE}/panels/` },
      { label: "Cloud", href: `${MAIN_SITE}/cloud` },
      { label: "Changelog", href: "https://github.com/django-control-room/dj-control-room/releases" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community", href: `${MAIN_SITE}/community` },
      { label: "News", href: `${MAIN_SITE}/news` },
      { label: "Discord", href: DISCORD_URL },
      { label: "GitHub", href: "https://github.com/django-control-room/dj-control-room" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "Consulting", href: `${MAIN_SITE}/consulting` }],
  },
];

const isExternal = (href: string) => !href.startsWith(MAIN_SITE);

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <a href={`${MAIN_SITE}/`} className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="font-heading text-xs font-bold text-primary-foreground">DCR</span>
            </div>
            <span className="font-heading text-sm font-semibold text-foreground">
              Django Control Room
            </span>
          </a>
          <p className="mt-3 text-xs text-muted-foreground">MIT License</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-5xl border-t border-border px-6 pt-6">
        <p className="text-center text-xs text-muted-foreground">
          Django is a registered trademark of the Django Software Foundation. This project is not
          affiliated with or endorsed by the DSF.
        </p>
      </div>
    </footer>
  );
}
