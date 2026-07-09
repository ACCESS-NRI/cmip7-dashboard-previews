/**
 * The dashboard's on-page sections, in scroll order. "Big picture" is the
 * always-visible primary content; "Progress" and "Under the hood" are the
 * collapsible detailed views beneath it. The sidebar nav (SectionNav) and the
 * page's section anchors are both built from this single list, so their ids
 * and labels can never drift apart.
 */
export type SectionId = "big-picture" | "progress" | "under-the-hood";

export interface SectionMeta {
  id: SectionId;
  name: string;
  description: string;
  icon: string;
}

/** Ordered top→bottom to match the page; the scroll-spy nav renders them as-is. */
export const SECTIONS: readonly SectionMeta[] = [
  {
    id: "big-picture",
    name: "Big picture",
    description: "What these experiments are and why they matter",
    icon: "i-lucide-telescope",
  },
  {
    id: "progress",
    name: "Progress",
    description: "How far each experiment has run, at a glance",
    icon: "i-lucide-gauge",
  },
  {
    id: "under-the-hood",
    name: "Under the hood",
    description: "Full run telemetry and derived plots",
    icon: "i-lucide-wrench",
  },
] as const;
