import type { Neighborhood } from "@/content/types";

export const neighborhoods: Neighborhood[] = [
  {
    slug: "downtown-boulder",
    name: "Downtown Boulder",
    description:
      "The walkable heart of the city where the Pearl Street Mall, flatiron views, and the best dining sit within a few blocks of one another.",
    overview:
      "The walkable core of the city. The Pearl Street Mall anchors a few square blocks of dining, galleries, and shops, with the Flatirons rising just to the west. Stay here to be in the middle of it all, steps from the best restaurants and an easy reach to festival venues.",
    highlights: ["Pearl Street Mall", "Most walkable", "Best dining"],
    image: "https://images.unsplash.com/photo-1723608437198-19aa47226832?w=1200&q=80",
    mapX: 26,
    mapY: 42,
  },
  {
    slug: "university-hill",
    name: "University Hill",
    description:
      "A spirited neighborhood beside the university campus, full of cafes, music venues, and quick access to Chautauqua trails.",
    overview:
      "A lively neighborhood beside the University of Colorado campus, full of cafes, music venues, and students. The Chautauqua trailheads sit minutes away, and downtown is a short walk to the north.",
    highlights: ["Next to CU", "Cafes and music", "Chautauqua access"],
    image: "https://images.unsplash.com/photo-1659730251471-1b1dfc88b491?w=1200&q=80",
    mapX: 23,
    mapY: 50,
  },
  {
    slug: "north-boulder",
    name: "North Boulder",
    description:
      "A relaxed residential district known for its art studios, open mountain horizons, and a quieter pace just minutes from downtown.",
    overview:
      "Known locally as NoBo, a relaxed residential district with art studios, an emerging dining scene, and open views toward the foothills. Quieter than downtown, with quick access in either direction.",
    highlights: ["Art district", "Quieter pace", "Foothill views"],
    image: "https://images.unsplash.com/photo-1516644267149-681fb9f0624c?w=1200&q=80",
    mapX: 24,
    mapY: 30,
  },
  {
    slug: "south-boulder",
    name: "South Boulder",
    description:
      "Family friendly streets backing onto the foothills, prized for trailheads, reservoir access, and wide views of the Front Range.",
    overview:
      "Family friendly streets backing onto the foothills and open space. Trailheads and the reservoir are close, and it is an easy reach south toward Denver.",
    highlights: ["Trailheads", "Open space", "Easy Denver reach"],
    image: "https://images.unsplash.com/photo-1653250947541-756cf6d786f4?w=1200&q=80",
    mapX: 25,
    mapY: 61,
  },
  {
    slug: "louisville",
    name: "Louisville",
    description:
      "A charming small town with a historic main street, easy weekend markets, and a welcoming community a short drive east of Boulder.",
    overview:
      "A charming small town a short drive east of Boulder, with a historic main street, weekend markets, and a welcoming pace. It is consistently ranked among the best places to live in Colorado.",
    highlights: ["Historic main street", "Family friendly", "Great value"],
    image: "https://images.unsplash.com/photo-1659730251471-1b1dfc88b491?w=1200&q=80",
    mapX: 54,
    mapY: 60,
  },
  {
    slug: "lafayette",
    name: "Lafayette",
    description:
      "An artsy and affordable enclave with creative breweries, local galleries, and quick connections to both Boulder and Denver.",
    overview:
      "An artsy, affordable enclave east of Boulder with creative breweries, local galleries, and quick connections to both Boulder and Denver.",
    highlights: ["Breweries", "Affordable", "Central"],
    image: "https://images.unsplash.com/photo-1516644267149-681fb9f0624c?w=1200&q=80",
    mapX: 50,
    mapY: 52,
  },
  {
    slug: "longmont",
    name: "Longmont",
    description:
      "A growing town that pairs a revitalized downtown with sweeping prairie and mountain views to the west.",
    overview:
      "A growing town north of Boulder that pairs a revitalized downtown with space and value, and sweeping mountain views to the west.",
    highlights: ["Space and value", "Revitalized downtown", "Mountain views"],
    image: "https://images.unsplash.com/photo-1723608437198-19aa47226832?w=1200&q=80",
    mapX: 46,
    mapY: 16,
  },
  {
    slug: "broomfield",
    name: "Broomfield",
    description:
      "A convenient midpoint between Boulder and Denver with modern amenities, open space trails, and easy airport access.",
    overview:
      "A convenient midpoint between Boulder and Denver with modern amenities, open space trails, and the quickest reach to Denver International Airport.",
    highlights: ["Central to both cities", "Airport access", "Modern amenities"],
    image: "https://images.unsplash.com/photo-1653250947541-756cf6d786f4?w=1200&q=80",
    mapX: 64,
    mapY: 70,
  },
  {
    slug: "denver",
    name: "Denver",
    description:
      "Colorado's vibrant capital, offering world class culture, sports, and nightlife under a backdrop of distant snowcapped peaks.",
    overview:
      "Colorado's capital, about a forty minute drive southeast, offering world class culture, dining, and nightlife with the festival a manageable day trip up the highway.",
    highlights: ["Big city base", "Culture and nightlife", "Day trip up"],
    image: "https://images.unsplash.com/photo-1648441095877-90406e6ba04d?w=1200&q=80",
    mapX: 84,
    mapY: 88,
  },
];

export const getNeighborhood = (slug: string) =>
  neighborhoods.find((n) => n.slug === slug);
