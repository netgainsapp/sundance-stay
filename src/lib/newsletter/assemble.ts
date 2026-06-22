import type {
  AdvertiserBlock,
  NewsletterContent,
  PostBlock,
  StayBlock,
} from "./types";
import { BOULDER_IMAGES } from "@/content/boulder-images";

export const FESTIVAL_WINDOW = "January 21 to 31, 2027";

export interface AssembleInput {
  posts: PostBlock[];
  advertisers: AdvertiserBlock[];
  stays: StayBlock[];
  heroImage?: string;
  subject?: string;
  previewText?: string;
  intro?: string;
  maxPosts?: number;
  maxAdvertisers?: number;
  maxStays?: number;
}

const DEFAULT_INTRO =
  "Boulder is getting ready for the Sundance Film Festival, running " +
  FESTIVAL_WINDOW +
  ". Here is the latest on where to stay, how to get around, and the local businesses making festival week easier.";

/**
 * Assembles a newsletter from owned content and advertiser assets. Deterministic
 * and pure: no model key required. Bounds each section so an issue stays tight.
 */
export function assembleNewsletter(input: AssembleInput): NewsletterContent {
  const {
    posts,
    advertisers,
    stays,
    subject = "Your Boulder and Sundance 2027 update",
    previewText = "New guides, places to stay, and local partners for festival week.",
    heroImage = BOULDER_IMAGES[0],
    intro = DEFAULT_INTRO,
    maxPosts = 3,
    maxAdvertisers = 4,
    maxStays = 3,
  } = input;

  return {
    subject,
    previewText,
    heroImage,
    intro,
    posts: posts.slice(0, maxPosts),
    advertisers: advertisers.slice(0, maxAdvertisers),
    stays: stays.slice(0, maxStays),
  };
}
