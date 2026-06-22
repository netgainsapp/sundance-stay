import type { Business } from "@/content/types";

export const businesses: Business[] = [
  // transportation
  {
    slug: "flatiron-car-service",
    name: "Flatiron Car Service",
    description:
      "Premium airport transfers and private drivers serving guests across Boulder County with a flawless, on time record.",
    category: "transportation",
    website: "https://flatiron-car-service.com",
    phone: "(303) 555-0100",
    email: "hello@flatiron-car-service.com",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Airport transfers", "Private chauffeur", "Hourly hire", "Event transport"],
    featured: true,
    tier: "premier",
  },
  {
    slug: "front-range-shuttle-co",
    name: "Front Range Shuttle Co",
    description:
      "Comfortable shuttle and group transport connecting Boulder, Denver, and the airport for parties of every size.",
    category: "transportation",
    website: "https://front-range-shuttle-co.com",
    phone: "(303) 555-0101",
    email: "hello@front-range-shuttle-co.com",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1400&q=80",
    serviceArea: "Boulder, Denver, and the airport corridor",
    services: ["Group shuttle", "Airport runs", "Festival transport", "Wedding transport"],
    featured: false,
    tier: "basic",
  },

  // cleaning
  {
    slug: "alpine-clean-boulder",
    name: "Alpine Clean Boulder",
    description:
      "Detail driven housekeeping and turnover crews that prepare every home to a spotless, guest ready standard.",
    category: "cleaning",
    website: "https://alpine-clean-boulder.com",
    phone: "(303) 555-0102",
    email: "hello@alpine-clean-boulder.com",
    logo: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Turnover cleaning", "Deep cleaning", "Laundry service", "Restocking"],
    featured: true,
    tier: "featured",
  },
  {
    slug: "summit-housekeeping",
    name: "Summit Housekeeping",
    description:
      "A reliable team of professional housekeepers offering scheduled and on demand cleaning throughout the county.",
    category: "cleaning",
    website: "https://summit-housekeeping.com",
    phone: "(303) 555-0103",
    email: "hello@summit-housekeeping.com",
    logo: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Scheduled cleaning", "Move out cleaning", "Window cleaning", "Linen service"],
    featured: false,
    tier: "basic",
  },

  // photography
  {
    slug: "chautauqua-photo-studio",
    name: "Chautauqua Photo Studio",
    description:
      "Editorial photographers capturing properties, events, and Front Range landscapes with a refined, natural style.",
    category: "photography",
    website: "https://chautauqua-photo-studio.com",
    phone: "(303) 555-0104",
    email: "hello@chautauqua-photo-studio.com",
    logo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Property photography", "Event coverage", "Drone aerials", "Portraits"],
    featured: true,
    tier: "featured",
  },
  {
    slug: "pearl-street-images",
    name: "Pearl Street Images",
    description:
      "A boutique studio specializing in real estate and lifestyle imagery for hosts and local businesses.",
    category: "photography",
    website: "https://pearl-street-images.com",
    phone: "(303) 555-0105",
    email: "hello@pearl-street-images.com",
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Listing photography", "Lifestyle shoots", "Twilight photography", "Virtual tours"],
    featured: false,
    tier: "basic",
  },

  // private-chef
  {
    slug: "flatirons-private-chef",
    name: "Flatirons Private Chef",
    description:
      "An in home chef service building seasonal tasting menus around the best Colorado ingredients for intimate dinners.",
    category: "private-chef",
    website: "https://flatirons-private-chef.com",
    phone: "(303) 555-0106",
    email: "hello@flatirons-private-chef.com",
    logo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Tasting menus", "Date night dinners", "Meal prep", "Wine pairings"],
    featured: true,
    tier: "premier",
  },
  {
    slug: "boulder-table-chefs",
    name: "Boulder Table Chefs",
    description:
      "A collective of private chefs offering personalized in home dining for families and small gatherings.",
    category: "private-chef",
    website: "https://boulder-table-chefs.com",
    phone: "(303) 555-0107",
    email: "hello@boulder-table-chefs.com",
    logo: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Family dinners", "Brunch service", "Special diets", "Cooking classes"],
    featured: false,
    tier: "basic",
  },

  // catering
  {
    slug: "front-range-catering",
    name: "Front Range Catering",
    description:
      "Full service catering for weddings, festivals, and corporate events with locally sourced, seasonal menus.",
    category: "catering",
    website: "https://front-range-catering.com",
    phone: "(303) 555-0108",
    email: "hello@front-range-catering.com",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Wedding catering", "Corporate events", "Buffet service", "Bar service"],
    featured: true,
    tier: "featured",
  },
  {
    slug: "mountain-feast-catering",
    name: "Mountain Feast Catering",
    description:
      "Approachable catering for backyard celebrations, festivals, and gatherings of any size across the county.",
    category: "catering",
    website: "https://mountain-feast-catering.com",
    phone: "(303) 555-0109",
    email: "hello@mountain-feast-catering.com",
    logo: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Festival catering", "Family style meals", "Grazing tables", "Dessert bars"],
    featured: false,
    tier: "basic",
  },

  // child-care
  {
    slug: "boulder-nanny-collective",
    name: "Boulder Nanny Collective",
    description:
      "A network of vetted, background checked sitters and nannies giving traveling families complete peace of mind.",
    category: "child-care",
    website: "https://boulder-nanny-collective.com",
    phone: "(303) 555-0110",
    email: "hello@boulder-nanny-collective.com",
    logo: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Hourly sitting", "Overnight care", "Event childcare", "Travel nannies"],
    featured: true,
    tier: "featured",
    credentials: [
      "All sitters background checked and reference verified",
      "CPR and pediatric first aid certified",
      "Member, International Nanny Association",
      "References available on request",
    ],
  },
  {
    slug: "front-range-sitters",
    name: "Front Range Sitters",
    description:
      "Trusted local sitters available on short notice so parents can enjoy a night out with confidence.",
    category: "child-care",
    website: "https://front-range-sitters.com",
    phone: "(303) 555-0111",
    email: "hello@front-range-sitters.com",
    logo: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["On call sitting", "Weekend care", "Group childcare", "Mommy and me help"],
    featured: false,
    tier: "basic",
    credentials: [
      "Background checked sitters with verified references",
      "CPR and first aid certified",
      "References available on request",
    ],
  },

  // pet-care
  {
    slug: "pearl-paws-pet-care",
    name: "Pearl Paws Pet Care",
    description:
      "Caring walkers and sitters who treat visiting pets like family while their people explore Boulder.",
    category: "pet-care",
    website: "https://pearl-paws-pet-care.com",
    phone: "(303) 555-0112",
    email: "hello@pearl-paws-pet-care.com",
    logo: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Dog walking", "Pet sitting", "Drop in visits", "Overnight stays"],
    featured: true,
    tier: "featured",
    credentials: [
      "Bonded and insured",
      "Pet first aid and CPR certified",
      "Member, Pet Sitters International",
      "References available on request",
    ],
  },
  {
    slug: "trailhead-dog-walkers",
    name: "Trailhead Dog Walkers",
    description:
      "Active dog walkers and adventure outings that keep four legged guests happy and well exercised.",
    category: "pet-care",
    website: "https://trailhead-dog-walkers.com",
    phone: "(303) 555-0113",
    email: "hello@trailhead-dog-walkers.com",
    logo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Trail walks", "Group play", "Grooming", "Pet taxi"],
    featured: false,
    tier: "basic",
    credentials: [
      "Bonded and insured",
      "Pet first aid certified",
      "References available on request",
    ],
  },

  // concierge
  {
    slug: "sundance-concierge",
    name: "Sundance Concierge",
    description:
      "Personal concierges who arrange reservations, tickets, and bespoke Boulder experiences for discerning guests.",
    category: "concierge",
    website: "https://sundance-concierge.com",
    phone: "(303) 555-0114",
    email: "hello@sundance-concierge.com",
    logo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Dining reservations", "Event tickets", "Custom itineraries", "Special requests"],
    featured: true,
    tier: "premier",
  },
  {
    slug: "front-range-concierge-collective",
    name: "Front Range Concierge Collective",
    description:
      "A boutique concierge team curating outdoor adventures, wellness days, and local discoveries on request.",
    category: "concierge",
    website: "https://front-range-concierge-collective.com",
    phone: "(303) 555-0115",
    email: "hello@front-range-concierge-collective.com",
    logo: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Adventure planning", "Wellness bookings", "Grocery delivery", "Welcome gifts"],
    featured: false,
    tier: "basic",
  },

  // home-preparation
  {
    slug: "ready-home-boulder",
    name: "Ready Home Boulder",
    description:
      "Stocking, staging, and welcome setups that have a property warm and ready the moment guests arrive.",
    category: "home-preparation",
    website: "https://ready-home-boulder.com",
    phone: "(303) 555-0116",
    email: "hello@ready-home-boulder.com",
    logo: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Pantry stocking", "Welcome setup", "Staging", "Seasonal prep"],
    featured: true,
    tier: "featured",
  },
  {
    slug: "arrival-prep-co",
    name: "Arrival Prep Co",
    description:
      "A home preparation service handling everything from fresh linens to fully stocked kitchens before check in.",
    category: "home-preparation",
    website: "https://arrival-prep-co.com",
    phone: "(303) 555-0117",
    email: "hello@arrival-prep-co.com",
    logo: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Linen setup", "Grocery stocking", "Home staging", "Welcome baskets"],
    featured: false,
    tier: "basic",
  },

  // snow-removal
  {
    slug: "frontier-snow-removal",
    name: "Frontier Snow Removal",
    description:
      "Dependable plowing and shoveling crews that keep driveways and walkways clear through every Colorado storm.",
    category: "snow-removal",
    website: "https://frontier-snow-removal.com",
    phone: "(303) 555-0118",
    email: "hello@frontier-snow-removal.com",
    logo: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Driveway plowing", "Walkway shoveling", "Ice management", "Seasonal contracts"],
    featured: false,
    tier: "basic",
  },
  {
    slug: "summit-snow-pros",
    name: "Summit Snow Pros",
    description:
      "A responsive winter crew offering rapid snow clearing and de icing for homes and shared driveways.",
    category: "snow-removal",
    website: "https://summit-snow-pros.com",
    phone: "(303) 555-0119",
    email: "hello@summit-snow-pros.com",
    logo: "https://images.unsplash.com/photo-1518176258769-f227c798150e?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Rapid clearing", "De icing", "Roof raking", "Storm response"],
    featured: false,
    tier: "basic",
  },

  // property-maintenance
  {
    slug: "flatiron-home-services",
    name: "Flatiron Home Services",
    description:
      "Skilled handymen and repair specialists who keep homes in pristine, guest ready condition all year round.",
    category: "property-maintenance",
    website: "https://flatiron-home-services.com",
    phone: "(303) 555-0120",
    email: "hello@flatiron-home-services.com",
    logo: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Handyman repairs", "Seasonal upkeep", "Appliance service", "Emergency calls"],
    featured: true,
    tier: "featured",
  },
  {
    slug: "boulder-property-care",
    name: "Boulder Property Care",
    description:
      "A full service maintenance team handling inspections, repairs, and upkeep so hosts can rest easy.",
    category: "property-maintenance",
    website: "https://boulder-property-care.com",
    phone: "(303) 555-0121",
    email: "hello@boulder-property-care.com",
    logo: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80",
    serviceArea: "Boulder and surrounding areas",
    services: ["Home inspections", "Preventive maintenance", "Painting", "Landscaping"],
    featured: false,
    tier: "basic",
  },
];

export const getBusiness = (slug: string) =>
  businesses.find((b) => b.slug === slug);

export const businessesByCategory = (category: string) =>
  businesses.filter((b) => b.category === category);

export const featuredBusinesses = () =>
  businesses.filter((b) => b.featured);
