import type { Neighborhood } from "@/content/types";

export const neighborhoods: Neighborhood[] = [
  {
    slug: "downtown-boulder",
    name: "Downtown Boulder",
    description:
      "The walkable heart of the city where the Pearl Street Mall, flatiron views, and the best dining sit within a few blocks of one another.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  },
  {
    slug: "university-hill",
    name: "University Hill",
    description:
      "A spirited neighborhood beside the university campus, full of cafes, music venues, and quick access to Chautauqua trails.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
  },
  {
    slug: "north-boulder",
    name: "North Boulder",
    description:
      "A relaxed residential district known for its art studios, open mountain horizons, and a quieter pace just minutes from downtown.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
  },
  {
    slug: "south-boulder",
    name: "South Boulder",
    description:
      "Family friendly streets backing onto the foothills, prized for trailheads, reservoir access, and wide views of the Front Range.",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
  },
  {
    slug: "louisville",
    name: "Louisville",
    description:
      "A charming small town with a historic main street, easy weekend markets, and a welcoming community a short drive east of Boulder.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
  },
  {
    slug: "lafayette",
    name: "Lafayette",
    description:
      "An artsy and affordable enclave with creative breweries, local galleries, and quick connections to both Boulder and Denver.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80",
  },
  {
    slug: "longmont",
    name: "Longmont",
    description:
      "A growing town that pairs a revitalized downtown with sweeping prairie and mountain views to the west.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
  },
  {
    slug: "broomfield",
    name: "Broomfield",
    description:
      "A convenient midpoint between Boulder and Denver with modern amenities, open space trails, and easy airport access.",
    image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200&q=80",
  },
  {
    slug: "denver",
    name: "Denver",
    description:
      "Colorado's vibrant capital, offering world class culture, sports, and nightlife under a backdrop of distant snowcapped peaks.",
    image: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1200&q=80",
  },
];

export const getNeighborhood = (slug: string) =>
  neighborhoods.find((n) => n.slug === slug);
