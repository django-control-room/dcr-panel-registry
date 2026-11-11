import { DISCORD_URL } from "@/lib/links";

const MAIN_SITE = "https://djangocontrolroom.com/";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="font-heading text-xs font-bold text-primary-foreground">DCR</span>
          </div>
          <span className="font-heading text-sm font-semibold">Panel Registry</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href={MAIN_SITE} className="transition-colors hover:text-foreground">
            Django Control Room
          </a>
          <a
            href="https://github.com/django-control-room"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Discord
          </a>
        </div>
        <p className="text-xs text-muted-foreground">MIT License</p>
      </div>
      <div className="mx-auto mt-6 max-w-5xl border-t border-border px-6 pt-6">
        <p className="text-center text-xs text-muted-foreground">
          Django is a registered trademark of the Django Software Foundation. This project is not
          affiliated with or endorsed by the DSF.
        </p>
      </div>
    </footer>
  );
}
