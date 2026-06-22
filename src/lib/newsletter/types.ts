/** Building blocks for a newsletter issue. Kept plain so assembly and render
 * stay pure and unit-testable. */

export interface AdvertiserBlock {
  name: string;
  blurb: string;
  logo: string;
  coverImage: string;
  href: string;
}

export interface PostBlock {
  title: string;
  excerpt: string;
  href: string;
  image: string;
}

export interface StayBlock {
  title: string;
  summary: string;
  href: string;
  image: string;
}

export interface NewsletterContent {
  subject: string;
  previewText: string;
  intro: string;
  posts: PostBlock[];
  advertisers: AdvertiserBlock[];
  stays: StayBlock[];
}

export interface NewsletterGuardrailResult {
  ok: boolean;
  reasons: string[];
}
