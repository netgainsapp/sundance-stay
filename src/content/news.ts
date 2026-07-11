// News desk: dated, source-attributed coverage of Festival Season developments.
// Unlike blog posts (evergreen guides), news items are tied to specific events
// and always cite their sources. The /news section is public (not waitlist
// gated) so this coverage is crawlable and shareable.

export type NewsSource = { name: string; url: string };

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Lodging" | "Development" | "Festival" | "City";
  publishedAt: string; // YYYY-MM-DD
  updatedAt?: string;
  sources: NewsSource[];
  tags: string[];
  content: string; // markdown rendered by ArticleBody
};

export const newsItems: NewsItem[] = [
  {
    slug: "downtown-boulder-110-room-hotel-2121-broadway",
    title: "Boulder Moves to Sell a Downtown Lot for a 110 Room Hotel as the Sundance Room Shortage Looms",
    excerpt:
      "City officials reached a tentative $5.8 million deal to sell a downtown parking lot to Midnight Auteur LLC, the team behind Denver's Ramble Hotel and Death & Co, for a 110 room hotel one block from the Boulderado.",
    category: "Development",
    publishedAt: "2026-07-11",
    sources: [
      {
        name: "BizWest, July 8, 2026",
        url: "https://bizwest.com/2026/07/08/downtown-boulder-could-soon-get-110-room-hotel/",
      },
    ],
    tags: ["hotels", "downtown boulder", "development", "sundance 2027"],
    content: `Boulder took a concrete step toward expanding its hotel supply this week. City officials said on July 8, 2026 that they have reached a tentative agreement to sell a city owned parking lot at 2121 Broadway to Midnight Auteur LLC for $5.8 million, clearing the way for a proposed 110 room hotel about one block from the Hotel Boulderado, as first reported by BizWest.

## Who is behind the project

Midnight Auteur LLC was formed by leaders of the Ramble Hotel in Denver and Death & Co, the New York born cocktail bar group with an outpost inside the Ramble. The 59 space lot they intend to buy is controlled by the Central Area General Improvement District, known as CAGID.

According to the BizWest report, the project plans include ground level commercial space, publicly accessible gathering areas, and a rooftop component, with the developer expressing interest in incorporating art and cultural events into the property.

## Why it matters for Festival Season

Boulder has roughly 2,900 hotel rooms inside city limits, and the Sundance Film Festival is expected to draw crowds far beyond that capacity every January for at least the next decade. Local officials and festival representatives have repeatedly said downtown Boulder needs more rooms.

The timing is the catch. A hotel at 2121 Broadway is not expected to be ready for the first Boulder festival in January 2027. The city told BizWest the lot should remain available for parking for at least the next year while the project goes through the entitlement process. This is a bet on the festival's second act, not its debut.

## What happens next

The Downtown Management Commission was scheduled to review the proposed sale agreement the week of July 13, with the deal then heading to Boulder City Council for approval in August 2026. Construction timelines remain unknown, and the city said it is too early to speculate.

One reporting note: this development has so far been covered in detail by a single outlet, BizWest, alongside statements from city officials. We will update this story as the council vote approaches.

For visitors sorting out where to stay for the 2027 festival while hotel supply catches up, our lodging guide tracks private homes and neighborhood options as they come online.`,
  },
  {
    slug: "festival-lodging-license-boulder-momentum-july-2026",
    title: "Boulder's Festival Lodging Program Gains Steam: Hundreds of Licenses Issued Ahead of Sundance 2027",
    excerpt:
      "Boulder has issued more than 260 festival lodging licenses with roughly 610 more pending, and the city's program held a homeowner webinar on July 9 as the push to expand Sundance lodging accelerates.",
    category: "Lodging",
    publishedAt: "2026-07-11",
    sources: [
      {
        name: "Boulder Festival Lodging Program (Visit Boulder)",
        url: "https://www.bouldercoloradousa.com/sundance-film-festival/festival-lodging-program/",
      },
      {
        name: "Boulder Reporting Lab, June 14, 2026",
        url: "https://boulderreportinglab.org/2026/06/14/boulder-bet-34-million-to-land-sundance-high-lodging-prices-are-raising-concerns/",
      },
      {
        name: "City of Boulder, 2027 Sundance Film Festival guide",
        url: "https://bouldercolorado.gov/guide/2027-sundance-film-festival",
      },
    ],
    tags: ["festival lodging license", "short term rentals", "homeowners", "sundance 2027"],
    content: `Boulder's plan to house tens of thousands of Sundance visitors in private homes is moving from ordinance to reality. The city's Festival Lodging Program held a homeowner webinar on July 9, 2026, the latest step in a licensing push that has already drawn strong local response.

## The numbers so far

As of mid June, Boulder had issued more than 260 festival lodging licenses with roughly 610 more applications pending, according to city officials cited by Boulder Reporting Lab. The city has also received hundreds of new applications for standard short term rental licenses since the festival announced its move to Boulder.

That inventory matters. The Sundance Film Festival runs January 21 to 31, 2027, and Boulder's hotels are already showing little to no availability for the festival window. Visit Boulder says the city's hotels have committed to making 70 percent of their room inventory available at affordable rates, but hotels alone cannot absorb the expected crowd.

## How the license works

The Festival Lodging Rental License allows Boulder homeowners to rent their home for short stays during city approved Special Festival Events. Key points from the city's program:

1. Applications are open now, and licenses began being issued in May 2026.
2. Owners of properties with Long Term Rental Licenses, and tenants in those properties with the owner's consent, can also participate. The city describes renter access as an equity component of the program.
3. Homes cannot be listed on Airbnb, VRBO, or similar platforms until the license is issued.
4. Licensed homes can appear on the major booking platforms as well as the official Sundance Film Festival booking engine.

Visit Boulder has vetted a list of property management partners for owners who do not want to self manage, and publishes suggested pricing as part of its host with heart effort to keep the festival affordable.

## The demand is already spilling over

Airbnb search data cited in the Boulder Reporting Lab story shows searches for Denver stays during the 2027 festival dates up 10 percent, while searches in Louisville, Nederland, Longmont, Lafayette, and Erie were up more than 100 percent. Attendees are already planning around Boulder's supply crunch.

If you own a Boulder home and are weighing the festival window, our home listing overview walks through what participation actually involves. If you are visiting, our neighborhood guides cover where private homes put you relative to the venues.`,
  },
  {
    slug: "fipresci-critics-jury-sundance-2027",
    title: "International Film Critics Will Judge at Sundance for the First Boulder Edition",
    excerpt:
      "FIPRESCI, the international federation of film critics, is establishing a jury at the Sundance Film Festival beginning with the January 2027 edition in Boulder, recognizing debut films in the world competitions.",
    category: "Festival",
    publishedAt: "2026-07-11",
    sources: [
      {
        name: "Sundance Institute announcement",
        url: "https://www.sundance.org/blogs/fipresci-establishes-jury-at-sundance-film-festival-2/",
      },
      {
        name: "Sundance Film Festival on X",
        url: "https://x.com/sundancefest/status/2074899883283058804",
      },
    ],
    tags: ["sundance 2027", "fipresci", "film programming", "boulder venues"],
    content: `The first Sundance Film Festival in Boulder will carry a new stamp of international credibility. Sundance Institute announced in July 2026 that FIPRESCI, the international federation of film critics, will establish a jury at the festival beginning with the 2027 edition, which runs January 21 to 31, 2027.

## What the jury will do

According to the festival's announcement, the FIPRESCI jury will recognize debut films from the World Narrative and World Documentary competitions. FIPRESCI juries are a fixture at major international festivals including Cannes, Berlin, and Venice, where the critics prize has often served as an early signal for films that go on to global acclaim.

For Sundance, adding a FIPRESCI prize in its first Boulder year reads as a statement: the move from Park City changes the setting, not the festival's standing in world cinema.

## What this means for the Boulder debut

Programming for the 2027 festival will not be announced until much closer to January. But the structural signals are accumulating. The festival has already named its venues: eleven screening locations spread across downtown Boulder, University Hill, Chautauqua, and the University of Colorado campus, plus four venues for talks and events.

A new international jury adds another reason for global industry attendance in year one, which has direct consequences for the town itself: more accredited press, more filmmakers with debut films, and more industry guests competing for rooms during the eleven day window.

## The bigger picture

Boulder's festival era begins January 21, 2027, and runs at least a decade under the festival's commitment to the city. Our guides cover the venue map, neighborhoods, and how to plan a stay around the festival core as details firm up.`,
  },
];

/** Newest first. */
export function allNews(): NewsItem[] {
  return [...newsItems].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return newsItems.find((n) => n.slug === slug);
}

export function newsSlugs(): string[] {
  return newsItems.map((n) => n.slug);
}
