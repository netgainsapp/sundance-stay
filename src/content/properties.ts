import type { Property } from "@/content/types";

export const properties: Property[] = [
  {
    slug: "pearl-street-penthouse",
    bookingUrl: "https://www.airbnb.com/",
    title: "Pearl Street Penthouse",
    description:
      "Perched above the Pearl Street Mall, this top floor residence pairs floor to ceiling windows with curated furnishings and uninterrupted flatiron views. Mornings begin with sunlight across the open living space and evenings end on a private terrace above the city lights. Every detail, from the chef grade kitchen to the spa inspired bath, has been chosen for guests who expect the very best.",
    summary:
      "A light filled penthouse above Pearl Street with flatiron views and a private terrace.",
    propertyType: "Loft",
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    city: "Boulder",
    state: "CO",
    neighborhoodSlug: "downtown-boulder",
    amenities: [
      "Private terrace",
      "Chef grade kitchen",
      "Flatiron views",
      "High speed wifi",
      "In unit laundry",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
        alt: "Bright open living room with large windows",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1400&q=80",
        alt: "Modern kitchen with marble counters",
        sortOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=80",
        alt: "Serene bedroom with soft natural light",
        sortOrder: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1400&q=80",
        alt: "Terrace seating with evening city views",
        sortOrder: 3,
      },
    ],
    featured: true,
    tier: "premier",
  },
  {
    slug: "chautauqua-trail-cottage",
    bookingUrl: "https://www.vrbo.com/",
    title: "Chautauqua Trail Cottage",
    description:
      "A storybook cottage moments from the Chautauqua trailheads, where the foothills rise just beyond the garden gate. Inside, warm wood floors and a stone fireplace create a comfortable retreat after a day on the trails. The covered porch invites slow mornings with coffee and the sound of the canyon wind.",
    summary:
      "A cozy foothills cottage steps from the Chautauqua trails and meadow.",
    propertyType: "House",
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    city: "Boulder",
    state: "CO",
    neighborhoodSlug: "university-hill",
    amenities: [
      "Stone fireplace",
      "Covered porch",
      "Trailhead access",
      "Fenced garden",
      "Pet friendly",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80",
        alt: "Charming cottage exterior with garden",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400&q=80",
        alt: "Living room with stone fireplace",
        sortOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80",
        alt: "Comfortable bedroom with wood accents",
        sortOrder: 2,
      },
    ],
    featured: true,
    tier: "featured",
  },
  {
    slug: "north-boulder-artist-loft",
    bookingUrl: "https://www.airbnb.com/",
    title: "North Boulder Artist Loft",
    description:
      "Set among the studios of the North Boulder art district, this airy loft celebrates light and craft. Soaring ceilings, gallery white walls, and a wall of windows frame the open mountain horizon. It is a calm, creative space for guests who want room to breathe and a quieter side of the city.",
    summary:
      "A light flooded loft in the North Boulder art district with mountain horizons.",
    propertyType: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    capacity: 3,
    city: "Boulder",
    state: "CO",
    neighborhoodSlug: "north-boulder",
    amenities: [
      "Soaring ceilings",
      "Mountain views",
      "Workspace nook",
      "High speed wifi",
      "Bike storage",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&q=80",
        alt: "Airy loft with tall ceilings",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=80",
        alt: "Bright living area with large windows",
        sortOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=80",
        alt: "Minimal bedroom with natural light",
        sortOrder: 2,
      },
    ],
    featured: true,
    tier: "featured",
  },
  {
    slug: "south-boulder-foothills-home",
    shortNotice: true,
    title: "South Boulder Foothills Home",
    description:
      "Backing directly onto open space, this spacious family home offers immediate access to trails and the reservoir. The great room opens onto a deck with wide Front Range views, ideal for gathering after a day outdoors. With room for the whole group, it balances comfort and a true sense of place.",
    summary:
      "A spacious family home backing onto open space with Front Range views.",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    city: "Boulder",
    state: "CO",
    neighborhoodSlug: "south-boulder",
    amenities: [
      "Open space access",
      "Mountain view deck",
      "Two car garage",
      "Gourmet kitchen",
      "Fire pit",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80",
        alt: "Modern family home exterior",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80",
        alt: "Open great room with mountain views",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
  {
    slug: "louisville-main-street-bungalow",
    bookingUrl: "https://www.vrbo.com/",
    title: "Louisville Main Street Bungalow",
    description:
      "A restored bungalow a short stroll from the historic Louisville main street and its weekend markets. Original character meets thoughtful updates, with a sunlit kitchen and a shaded backyard built for relaxed evenings. It is the perfect base for guests who love small town charm with easy reach to Boulder.",
    summary:
      "A restored bungalow near the historic Louisville main street and markets.",
    propertyType: "House",
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    city: "Louisville",
    state: "CO",
    neighborhoodSlug: "louisville",
    amenities: [
      "Walkable main street",
      "Sunlit kitchen",
      "Shaded backyard",
      "High speed wifi",
      "Off street parking",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1400&q=80",
        alt: "Welcoming bungalow with front porch",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1400&q=80",
        alt: "Sunlit kitchen with vintage charm",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
  {
    slug: "lafayette-garden-townhome",
    shortNotice: true,
    title: "Lafayette Garden Townhome",
    description:
      "A bright modern townhome in the heart of Lafayette, surrounded by breweries, galleries, and local cafes. The open plan living space flows to a private patio framed by raised garden beds. Comfortable and easy, it suits both weekend explorers and longer creative stays.",
    summary:
      "A modern townhome in artsy Lafayette with a private garden patio.",
    propertyType: "Townhome",
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    city: "Lafayette",
    state: "CO",
    neighborhoodSlug: "lafayette",
    amenities: [
      "Private patio",
      "Garden beds",
      "Open plan living",
      "High speed wifi",
      "In unit laundry",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1400&q=80",
        alt: "Contemporary townhome interior",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1400&q=80",
        alt: "Private patio with garden beds",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
  {
    slug: "longmont-prairie-view-cabin",
    bookingUrl: "https://www.airbnb.com/",
    title: "Longmont Prairie View Cabin",
    description:
      "A peaceful cabin on the edge of Longmont where the prairie opens to the western peaks. Warm timber interiors and a wood stove make it a snug winter escape, while the wraparound deck shines in summer. Wide skies and quiet nights define every stay here.",
    summary:
      "A timber cabin on the Longmont prairie with sweeping mountain sunsets.",
    propertyType: "Cabin",
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    city: "Longmont",
    state: "CO",
    neighborhoodSlug: "longmont",
    amenities: [
      "Wood stove",
      "Wraparound deck",
      "Prairie views",
      "High speed wifi",
      "Pet friendly",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1400&q=80",
        alt: "Cozy timber cabin at golden hour",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=1400&q=80",
        alt: "Rustic interior with wood stove",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
  {
    slug: "broomfield-skyline-condo",
    shortNotice: true,
    title: "Broomfield Skyline Condo",
    description:
      "A sleek contemporary condo positioned conveniently between Boulder and Denver, with easy airport access. Floor to ceiling glass frames distant peaks, and the building amenities add a resort like ease to any stay. It is an ideal landing spot for travelers who want modern comfort and quick connections.",
    summary:
      "A sleek condo midway between Boulder and Denver with skyline views.",
    propertyType: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    city: "Broomfield",
    state: "CO",
    neighborhoodSlug: "broomfield",
    amenities: [
      "Floor to ceiling windows",
      "Fitness center",
      "Secure parking",
      "High speed wifi",
      "Rooftop lounge",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80",
        alt: "Modern condo living room with glass walls",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&q=80",
        alt: "Stylish bedroom with city outlook",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
  {
    slug: "denver-lodo-loft",
    bookingUrl: "https://www.airbnb.com/",
    title: "Denver LoDo Loft",
    description:
      "An exposed brick loft in the historic Lower Downtown district, surrounded by Denver's best dining, galleries, and ballpark energy. Industrial details meet plush furnishings for a stay that feels both urban and warm. From here the whole capital city is at your doorstep, with the mountains a short drive west.",
    summary:
      "An exposed brick loft in historic LoDo at the center of Denver life.",
    propertyType: "Condo",
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    city: "Denver",
    state: "CO",
    neighborhoodSlug: "denver",
    amenities: [
      "Exposed brick",
      "Walkable downtown",
      "Designer furnishings",
      "High speed wifi",
      "Elevator access",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1400&q=80",
        alt: "Industrial loft with exposed brick",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=80",
        alt: "Warm bedroom with city character",
        sortOrder: 1,
      },
    ],
    featured: false,
    tier: "basic",
  },
];

export const getProperty = (slug: string) =>
  properties.find((p) => p.slug === slug);

export const featuredProperties = () =>
  properties.filter((p) => p.featured).slice(0, 3);

export const propertiesByNeighborhood = (slug: string) =>
  properties.filter((p) => p.neighborhoodSlug === slug);

export const shortNoticeProperties = () =>
  properties.filter((p) => p.shortNotice);
