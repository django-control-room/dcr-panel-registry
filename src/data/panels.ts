export interface Panel {
  slug: string;
  name: string;
  label: string;
  tagline: string;
  description: string;
  category: string;
  installCmd: string;
  github: string | null;
  docs: string | null;
  highlights: string[];
  maintainer: string;
  firstRelease: string;
}

export const panels: Panel[] = [
  {
    slug: "dj-redis-panel",
    name: "dj-redis-panel",
    label: "Redis",
    tagline: "Redis monitoring, inside your admin",
    description:
      "Get full visibility into your Redis instances without leaving Django. Inspect keys, monitor memory usage, view real-time stats, and debug connection issues, all from a familiar interface.",
    category: "Infrastructure",
    installCmd: "pip install dj-redis-panel",
    github: "https://github.com/django-control-room/dj-redis-panel",
    docs: "https://django-control-room.github.io/dj-control-room/",
    highlights: [
      "Live key browser with search and filtering",
      "Memory and connection stats at a glance",
      "Per-database breakdown and metrics",
      "Works with Redis, Redis Cluster, and Sentinel",
    ],
    maintainer: "Django Control Room",
    firstRelease: "2024-11-01",
  },
  {
    slug: "dj-cache-panel",
    name: "dj-cache-panel",
    label: "Cache",
    tagline: "Cache visibility, zero guesswork",
    description:
      "Understand exactly what's happening in your cache layer. Visualize hit rates, inspect stored keys, and debug invalidation issues so you can stop guessing and start optimizing.",
    category: "Performance",
    installCmd: "pip install dj-cache-panel",
    github: "https://github.com/django-control-room/dj-cache-panel",
    docs: "https://django-control-room.github.io/dj-control-room/",
    highlights: [
      "Cache hit/miss ratio tracking over time",
      "Key inspection with TTL and size details",
      "Backend-agnostic: Memcached, Redis, file, and more",
      "Invalidation debugging and bulk operations",
    ],
    maintainer: "Django Control Room",
    firstRelease: "2025-01-15",
  },
  {
    slug: "dj-celery-panel",
    name: "dj-celery-panel",
    label: "Celery",
    tagline: "Task queues, tamed",
    description:
      "Monitor your Celery workers, queues, and tasks from Django admin. See what's running, what's failed, and what's stuck without deploying Flower or a separate monitoring stack.",
    category: "Background jobs",
    installCmd: "pip install dj-celery-panel",
    github: "https://github.com/django-control-room/dj-celery-panel",
    docs: "https://django-control-room.github.io/dj-control-room/",
    highlights: [
      "Real-time worker and queue status overview",
      "Task history with failure details and retries",
      "Queue depth and throughput metrics",
      "Revoke, retry, and inspect tasks from the admin",
    ],
    maintainer: "Django Control Room",
    firstRelease: "2025-03-01",
  },
  {
    slug: "dj-urls-panel",
    name: "dj-urls-panel",
    label: "URLs",
    tagline: "Your URL map, at a glance",
    description:
      "Browse every registered URL pattern, namespace, and view in your Django project. Search, filter, and reverse-lookup routes without touching the terminal.",
    category: "Developer tooling",
    installCmd: "pip install dj-urls-panel",
    github: "https://github.com/django-control-room/dj-urls-panel",
    docs: "https://django-control-room.github.io/dj-control-room/",
    highlights: [
      "Full URL pattern tree with namespace grouping",
      "Reverse lookup and search across all routes",
      "View function and class details for each endpoint",
      "Test and validate URL resolution directly from the admin",
    ],
    maintainer: "Django Control Room",
    firstRelease: "2025-05-20",
  },
  {
    slug: "dj-signals-panel",
    name: "dj-signals-panel",
    label: "Signals",
    tagline: "Your signal landscape, fully mapped",
    description:
      "Get full visibility into your project's signal landscape. See which signals are registered, which receivers are connected, and what that receiver code actually does.",
    category: "Developer tooling",
    installCmd: "pip install dj-signals-panel",
    github: "https://github.com/django-control-room/dj-signals-panel",
    docs: "https://django-control-room.github.io/dj-control-room/",
    highlights: [
      "Complete overview of all registered signals",
      "Receiver mapping with source module details",
      "Built in vs custom signal breakdown",
      "Inspect receiver code directly from the admin",
    ],
    maintainer: "Django Control Room",
    firstRelease: "2025-07-10",
  },
];

export function getPanel(slug: string) {
  return panels.find((p) => p.slug === slug);
}
