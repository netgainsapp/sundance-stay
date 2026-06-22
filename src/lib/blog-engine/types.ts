/** Shared types for the automated blog engine. Decoupled from Prisma and the
 * content modules so the brain (topics, grounding, guardrails, assembly) stays
 * pure and unit-testable against fixtures. */

export type PostType = "neighborhood" | "category" | "cornerstone";

export interface TopicCandidate {
  topicKey: string;
  label: string;
  postType: PostType;
  source: "neighborhood" | "category" | "seed";
  score: number;
}

/** Owned-catalog input the engine grounds posts in. */
export interface CatalogNeighborhood {
  slug: string;
  name: string;
  overview: string;
  highlights: string[];
}
export interface CatalogProperty {
  neighborhoodSlug: string;
  propertyType: string;
  capacity: number;
}
export interface CatalogBusiness {
  name: string;
  category: string;
  services: string[];
}
export interface CatalogServiceCategory {
  slug: string;
  name: string;
}
export interface BlogCatalog {
  neighborhoods: CatalogNeighborhood[];
  properties: CatalogProperty[];
  businesses: CatalogBusiness[];
  serviceCategories: CatalogServiceCategory[];
}

/** Facts the model writes around. allowedEntities are the proper nouns the
 * post is permitted to name; the prompt forbids inventing others. */
export interface GroundedData {
  topicKey: string;
  postType: PostType;
  summary: string;
  facts: Record<string, string | number | string[]>;
  allowedEntities: string[];
}

export interface DraftSection {
  heading: string;
  body: string;
}

/** Raw model output, before assembly and persistence. */
export interface GeneratedDraft {
  title: string;
  dek?: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: DraftSection[];
  tags: string[];
}

export interface GuardrailResult {
  ok: boolean;
  reasons: string[];
}

/** A post ready for guardrail checking (assembled body + metadata). */
export interface CandidatePost {
  topicKey: string;
  postType: PostType;
  title: string;
  slug: string;
  excerpt: string;
  bodyMd: string;
  tags: string[];
}
