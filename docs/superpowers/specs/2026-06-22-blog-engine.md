# Sundance Stay Automated Blog Engine (V1) — Design

Date: 2026-06-22
Status: DRAFT for approval
Repo: sundance-stay (Next 16, Prisma + Neon, Resend). Mirrors the attiq.io blog
engine (`attic-api/docs/superpowers/specs/2026-06-12-attiq-blog-engine-design.md`).

## Goal

A self-feeding SEO blog that drips new Boulder + Sundance posts with NO per-post
human review. Scott reviews the live result, not drafts. Same safety model as
the Attiq engine: it ships DORMANT and publishes nothing until a model key is
set and a kill-switch flag is flipped on.

The 10 hand-written posts already in `src/content/blog.ts` stay as the curated
cornerstones. The engine adds an auto-generated drip alongside them.

## Hard requirement: automated, never slop

No human gate, so brand protection lives entirely in code:

- **Facts come from owned data, never the LLM.** Attiq grounds in real comp
  numbers; we ground in the site's catalog: the 12 researched neighborhoods,
  the property and business listings, the service categories, and the fixed
  festival facts (Jan 21 to 31, 2027). The model writes prose around a
  `dataSnapshot` of these facts and is forbidden from inventing business names,
  place names, prices, or stats.
- **No grounding, no post.** A topic whose grounding is too thin (e.g. a
  neighborhood with no listed homes or businesses) is skipped, never written.
- **Guardrails gate every publish.** A generated post that fails any gate is
  saved as `draft` with reasons logged, never published.
- **One kill switch.** A `feature_flag` row `blog_autopublish` (default OFF)
  gates the publish step. The engine ships dormant.

## Architecture (Prisma + Neon, mirrors Attiq stages)

### 1. Data model (Prisma)
- `GeneratedPost`: id, slug (unique), title, dek, excerpt, bodyMd, postType
  (neighborhood|category|cornerstone), status (draft|published|unpublished),
  topicKey, dataSnapshot (Json), seoTitle, seoDescription, tags (Json),
  guardrailReasons (Json), createdAt/updatedAt/publishedAt.
- `BlogTopic`: topicKey (unique), label, postType, source
  (neighborhood|category|seed), status (candidate|used|skipped_thin), score,
  lastAttemptAt.
- `FeatureFlag`: key (unique), enabled. Seed `blog_autopublish=false`.

### 2. Topic mining — `lib/blog-engine/topics.ts` (pure, tested)
`rankTopics(catalog)` over owned data: one `neighborhood` topic per neighborhood
that has homes or businesses, one `category` topic per service category with
listings, plus a static seed list of `cornerstone` topics. Dedupe vs existing
topicKeys. Pure ranking, unit-tested.

### 3. Grounding — `lib/blog-engine/grounding.ts` (pure, tested)
`groundTopic(topic, catalog): GroundedData | null`. For a neighborhood topic:
the neighborhood overview + highlights, the count and types of homes there,
and a few real businesses serving it. For a category topic: the real businesses
in that category. Returns `null` when the grounding is too thin (below
`MIN_FACTS`). Cornerstone posts pass a minimal festival-facts snapshot.

### 4. Generation — `lib/blog-engine/generate.ts`
Vercel AI SDK `generateObject` against a Zod schema
`{ title, dek, excerpt, seoTitle, seoDescription, sections: {heading, body}[], tags }`.
System prompt enforces brand voice (ZERO dashes and hyphens, US audience, no
overclaiming) and forbids naming any business or place not in the grounding.
No-ops cleanly when the model key is absent (like the Resend dry-run), so build
and deploy are always safe. Pure schema-to-bodyMd assembly is unit-tested; the
model call is isolated behind one function. Provider: AI SDK via Vercel AI
Gateway (`AI_GATEWAY_API_KEY`), model string default.

### 5. Guardrails — `lib/blog-engine/guardrails.ts` (pure, exhaustively tested)
`checkPost(post, snapshot, recentPosts): { ok, reasons[] }`:
1. **Grounding backing:** non-cornerstone posts require a non-null snapshot.
2. **Dedupe:** topicKey not published; slug unique; body shingle-similarity vs
   recent posts below threshold.
3. **Structure:** length bounds, intro + >= 3 sections + a CTA.
4. **Brand voice:** no em/en dash or hyphen-as-dash (regex), banned overclaim
   phrases, no model artifacts ("as an AI", "in conclusion"), title <= 70 chars.
5. **Entity integrity:** every business or place name in bodyMd must appear in
   the dataSnapshot's allowed-entity list. This is the analog of Attiq's
   numbers-integrity gate, and the core anti-fabrication guard.
Fail -> store `draft` + reasons, never publish.

### 6. Public rendering (union of file posts + DB posts)
`/blog` index and `/blog/[slug]` render the union of the curated file posts
(`src/content/blog.ts`) and published `GeneratedPost` rows, newest first, via
the existing `ArticleBody` + `BlogCard` + Article/Breadcrumb/FAQ JSON-LD.
Sitemap extended to include published generated slugs. RSS at `/blog/rss.xml`.

### 7. Automation — `app/api/cron/blog-generate/route.ts`
Vercel cron (cron-secret protected). Per run: refresh topic backlog -> pick
next eligible candidate -> ground -> generate -> guardrails -> publish (if
`blog_autopublish` on and gates pass) else save draft + reasons -> revalidate
`/blog` + sitemap. One post per run; schedule 3 runs/week. Cost-guarded.

### 8. Admin + kill switch — `app/admin/blog`
Reuses admin auth/layout. Lists generated posts (status, type, topic, guardrail
reasons), bulk unpublish/republish, regenerate, trigger seed. Toggles the
`blog_autopublish` flag. Default OFF.

## Safety / cost
- Generation no-ops without the model key; build + deploy always safe.
- Flag defaults OFF: ships dormant, nothing auto-publishes until Scott enables.
- 1 post/run, 3/week, plus a one-time seed. Bounded model spend.
- New ops deps (gated on Scott): `AI_GATEWAY_API_KEY`, a `CRON_SECRET`, and the
  Vercel cron registration.

## Phasing
1. Data model + render union + `/admin/blog` list + flag (safe, no model key).
2. Topics + grounding + guardrails + generation (the brain), full unit coverage.
3. Cron + seed + kill switch (the autopilot), ships dormant.
