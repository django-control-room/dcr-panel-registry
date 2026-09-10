import { supabase } from "@/integrations/supabase/client";

export interface PanelRow {
  id: string;
  slug: string;
  name: string;
  label: string;
  tagline: string;
  description: string;
  category: string;
  install_cmd: string;
  github_url: string | null;
  docs_url: string | null;
  site_url: string | null;
  highlights: string[];
  maintainer: string | null;
  first_release: string | null;
}

export interface RequestRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  rationale: string | null;
  category: string;
  status: string;
  author_name: string | null;
  created_at: string;
}

export const panelsQuery = {
  queryKey: ["panels"],
  queryFn: async (): Promise<PanelRow[]> => {
    const { data, error } = await supabase
      .from("panels")
      .select("*")
      .order("first_release", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PanelRow[];
  },
};

export const requestsQuery = {
  queryKey: ["panel_requests"],
  queryFn: async (): Promise<{ requests: RequestRow[]; votes: Record<string, number> }> => {
    const [requestsRes, votesRes] = await Promise.all([
      supabase.from("panel_requests").select("*").order("created_at", { ascending: true }),
      supabase.from("panel_request_votes").select("request_id"),
    ]);
    if (requestsRes.error) throw requestsRes.error;
    if (votesRes.error) throw votesRes.error;

    const votes: Record<string, number> = {};
    for (const row of votesRes.data ?? []) {
      votes[row.request_id] = (votes[row.request_id] ?? 0) + 1;
    }
    return { requests: (requestsRes.data ?? []) as RequestRow[], votes };
  },
};

const VOTER_STORAGE_KEY = "dcr-registry-voter-key";

export function getVoterKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(VOTER_STORAGE_KEY);
  if (!key) {
    key = `v-${crypto.randomUUID()}`;
    window.localStorage.setItem(VOTER_STORAGE_KEY, key);
  }
  return key;
}

export async function fetchMyVotes(): Promise<string[]> {
  const voterKey = getVoterKey();
  if (!voterKey) return [];
  const { data, error } = await supabase
    .from("panel_request_votes")
    .select("request_id")
    .eq("voter_key", voterKey);
  if (error) throw error;
  return (data ?? []).map((row) => row.request_id);
}

export async function toggleVote(requestId: string, hasVoted: boolean) {
  const voterKey = getVoterKey();
  if (hasVoted) {
    const { error } = await supabase
      .from("panel_request_votes")
      .delete()
      .eq("request_id", requestId)
      .eq("voter_key", voterKey);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("panel_request_votes")
    .insert({ request_id: requestId, voter_key: voterKey });
  if (error) throw error;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function submitRequest(input: {
  title: string;
  summary: string;
  rationale: string;
  category: string;
  author_name: string;
}) {
  const base = slugify(input.title) || "panel-idea";
  const { error } = await supabase.from("panel_requests").insert({
    title: input.title.trim(),
    slug: `${base}-${Math.random().toString(36).slice(2, 6)}`,
    summary: input.summary.trim(),
    rationale: input.rationale.trim() || null,
    category: input.category,
    status: "requested",
    author_name: input.author_name.trim() || "Anonymous",
  });
  if (error) throw error;
}

export const statusLabels: Record<string, string> = {
  requested: "Requested",
  planned: "Planned",
  in_progress: "In progress",
  shipped: "Shipped",
};
