import type { NewsletterContent } from "./types";

export const UNSUBSCRIBE_PLACEHOLDER = "{{UNSUBSCRIBE_URL}}";

const CHARCOAL = "#1F2933";
const MOUNTAIN = "#1D4E89";
const COPPER = "#B87333";
const SAND = "#F4ECDD";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function abs(siteUrl: string, href: string): string {
  return href.startsWith("http") ? href : `${siteUrl}${href}`;
}

/** Renders an email-safe HTML newsletter. The unsubscribe footer carries a
 * placeholder the sender replaces per recipient. Pure. */
export function renderNewsletterHtml(
  c: NewsletterContent,
  opts: { siteUrl: string },
): string {
  const { siteUrl } = opts;
  const sections: string[] = [];

  sections.push(
    `<tr><td style="padding:28px 28px 8px;font-family:Georgia,serif;font-size:22px;color:${CHARCOAL};font-weight:bold;">Sundance Stay Collective</td></tr>`,
    `<tr><td style="padding:0 28px 18px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#465058;">${esc(c.intro)}</td></tr>`,
  );

  if (c.posts.length > 0) {
    sections.push(
      `<tr><td style="padding:8px 28px;font-family:Georgia,serif;font-size:18px;color:${CHARCOAL};">From the blog</td></tr>`,
    );
    for (const p of c.posts) {
      sections.push(
        `<tr><td style="padding:8px 28px;"><a href="${abs(siteUrl, p.href)}" style="text-decoration:none;color:${MOUNTAIN};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${esc(p.title)}</a><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#465058;margin-top:4px;">${esc(p.excerpt)}</div></td></tr>`,
      );
    }
  }

  if (c.advertisers.length > 0) {
    sections.push(
      `<tr><td style="padding:18px 28px 4px;font-family:Georgia,serif;font-size:18px;color:${CHARCOAL};">Local partners for festival week</td></tr>`,
    );
    for (const a of c.advertisers) {
      sections.push(
        `<tr><td style="padding:8px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SAND};border-radius:10px;overflow:hidden;">
            <tr><td><img src="${esc(a.coverImage)}" width="100%" alt="${esc(a.name)}" style="display:block;width:100%;max-height:160px;object-fit:cover;" /></td></tr>
            <tr><td style="padding:14px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle"><img src="${esc(a.logo)}" width="40" height="40" alt="" style="display:block;width:40px;height:40px;border-radius:8px;object-fit:cover;" /></td>
                <td valign="middle" style="padding-left:10px;font-family:Georgia,serif;font-size:16px;color:${CHARCOAL};font-weight:bold;">${esc(a.name)}</td>
              </tr></table>
              <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#465058;margin-top:8px;">${esc(a.blurb)}</div>
              <a href="${abs(siteUrl, a.href)}" style="display:inline-block;margin-top:10px;font-family:Arial,sans-serif;font-size:14px;color:${COPPER};font-weight:bold;text-decoration:none;">Learn more</a>
            </td></tr>
          </table>
        </td></tr>`,
      );
    }
  }

  if (c.stays.length > 0) {
    sections.push(
      `<tr><td style="padding:18px 28px 4px;font-family:Georgia,serif;font-size:18px;color:${CHARCOAL};">Homes for the festival window</td></tr>`,
    );
    for (const s of c.stays) {
      sections.push(
        `<tr><td style="padding:8px 28px;"><a href="${abs(siteUrl, s.href)}" style="text-decoration:none;color:${MOUNTAIN};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${esc(s.title)}</a><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#465058;margin-top:4px;">${esc(s.summary)}</div></td></tr>`,
      );
    }
  }

  sections.push(
    `<tr><td style="padding:24px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a929a;border-top:1px solid #e6e2d8;">You are receiving this because you signed up for festival lodging alerts from Sundance Stay Collective. Not affiliated with the Sundance Institute or the Sundance Film Festival.<br/><a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:#8a929a;">Unsubscribe</a></td></tr>`,
  );

  return `<!doctype html><html><body style="margin:0;background:#eceae3;">
  <span style="display:none;font-size:1px;color:#eceae3;">${esc(c.previewText)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eceae3;padding:24px 0;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;max-width:600px;width:100%;">
      ${sections.join("")}
    </table>
  </td></tr></table></body></html>`;
}

/** Plain-text fallback. Pure. */
export function renderNewsletterText(
  c: NewsletterContent,
  opts: { siteUrl: string },
): string {
  const { siteUrl } = opts;
  const lines: string[] = [c.intro, ""];
  if (c.posts.length) {
    lines.push("FROM THE BLOG");
    for (const p of c.posts) lines.push(`- ${p.title}: ${abs(siteUrl, p.href)}`);
    lines.push("");
  }
  if (c.advertisers.length) {
    lines.push("LOCAL PARTNERS FOR FESTIVAL WEEK");
    for (const a of c.advertisers) lines.push(`- ${a.name}: ${abs(siteUrl, a.href)}`);
    lines.push("");
  }
  if (c.stays.length) {
    lines.push("HOMES FOR THE FESTIVAL WINDOW");
    for (const s of c.stays) lines.push(`- ${s.title}: ${abs(siteUrl, s.href)}`);
    lines.push("");
  }
  lines.push("Unsubscribe: " + UNSUBSCRIBE_PLACEHOLDER);
  return lines.join("\n");
}
