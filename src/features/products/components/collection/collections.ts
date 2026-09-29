import { BadgeCheck, Bookmark, Flame, Heart, Package, Sparkles, Star, Tags, ThumbsUp, Trophy, type LucideIcon } from "lucide-react";
import type { DiscoveryFeedType } from "@/core/api/services/discovery";

export type CollectionTone = "trending" | "gold" | "fresh" | "deal" | "default";

export type CollectionIdentity = {
  label: string;
  /** One-line editorial summary shown under the title. */
  lead: string;
  /** How the collection is ranked; must match the discovery feed's real ordering. */
  description: string;
  tone: CollectionTone;
  Icon: LucideIcon;
};

// Copy describes what each /discovery/feed type actually ranks by
// (see ZentoraBackend discovery_repo.go / discovery_metrics_repo.go).
const COLLECTIONS: Partial<Record<DiscoveryFeedType, CollectionIdentity>> = {
  trending: {
    label: "Trending Now", tone: "trending", Icon: Flame,
    lead: "What shoppers are looking at this week.",
    description: "Ranked by product views and purchases on Zentora over the past 7 days.",
  },
  best_sellers: {
    label: "Best Sellers", tone: "gold", Icon: Trophy,
    lead: "The products shoppers are buying most.",
    description: "Ranked by units purchased on Zentora over the past 7 days.",
  },
  new_arrivals: {
    label: "New Arrivals", tone: "fresh", Icon: Sparkles,
    lead: "Fresh additions to the Zentora store.",
    description: "The newest products in the store, most recently added first.",
  },
  deals: {
    label: "Deals", tone: "deal", Icon: Tags,
    lead: "Products with a discount running now.",
    description: "Largest discounts first. Prices shown already include the discount.",
  },
  featured: {
    label: "Featured", tone: "default", Icon: BadgeCheck,
    lead: "Standout products selected by the Zentora team.",
    description: "Hand-picked products from across the store.",
  },
  editorial: {
    label: "Editor's Picks", tone: "default", Icon: Bookmark,
    lead: "Products highlighted across the Zentora storefront.",
    description: "Products our team features in storefront sections.",
  },
  highly_rated: {
    label: "Highly Rated", tone: "gold", Icon: Star,
    lead: "Products customers rate highest.",
    description: "Reviewed products only, highest average rating first.",
  },
  most_wishlisted: {
    label: "Most Wishlisted", tone: "deal", Icon: Heart,
    lead: "Products shoppers save most.",
    description: "Ranked by how many shoppers have saved each product.",
  },
  recommended: {
    label: "Recommended", tone: "default", Icon: ThumbsUp,
    lead: "Picked for you.",
    description: "Based on your activity on Zentora.",
  },
};

export const getCollectionIdentity = (slug: string): CollectionIdentity =>
  COLLECTIONS[slug as DiscoveryFeedType] ?? {
    label: slug.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    lead: "A curated Zentora collection.",
    description: "Products from this collection.",
    tone: "default",
    Icon: Package,
  };
