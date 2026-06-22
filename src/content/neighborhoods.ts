import type { Neighborhood } from "@/content/types";

export const neighborhoods: Neighborhood[] = [
  {
    slug: "downtown-boulder",
    name: "Downtown Boulder",
    description:
      "The walkable heart of the city where the Pearl Street Mall, flatiron views, and the best dining sit within a few blocks of one another.",
    overview:
      "The lively heart of the city, centered on the brick paved Pearl Street Mall, a pedestrian stretch of boutiques, galleries, rooftop bars, and street performers under the Flatirons. It is home to some of Boulder's best known restaurants, from Frasca to The Kitchen, and it is the most walkable place to base your festival stay.",
    highlights: ["Pearl Street Mall", "Most walkable", "Top dining"],
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
      "Known as The Hill, this spirited college neighborhood sits just west of the CU Boulder campus along 13th Street. Expect casual eats, the legendary Fox Theatre and The Sink, live music, and an easy walk to both downtown and the Chautauqua trailheads.",
    highlights: ["Next to CU", "Fox Theatre and music", "Walk to trails"],
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
      "NoBo trades the bustle of downtown for a creative, laid back pace. The NoBo Art District anchors First Friday art walks among studios and galleries, while the Rayback Collective beer garden, neighborhood breweries, and Wonderland Lake trails draw young families and makers.",
    highlights: ["NoBo Art District", "Breweries and food trucks", "Lakeside trails"],
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
      "Quieter and family friendly, South Boulder backs right onto the foothills. It is the gateway to Chautauqua Park and the Bear Peak and South Boulder Creek trails, with the Table Mesa shopping area for everyday needs and an easy drive south toward Denver.",
    highlights: ["Chautauqua Park", "Foothills trails", "Family friendly"],
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
      "A short drive east of Boulder, Louisville pairs a historic Front Street downtown with a small town pace that keeps landing it on best places to live lists. Wander to the 1904 era 740 Front, Sweet Cow ice cream, and Tilt Pinball, catch the summer Friday Street Faire, and walk the Coal Creek Trail.",
    highlights: ["Historic Front Street", "Summer Street Faire", "Best places to live"],
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
      "Old Town Lafayette is the creative, eclectic counterpart to Boulder, built along Public Road and covered in murals and public art around the Collective Community Arts Center. It has become a craft beer destination, with Liquid Mechanics, Odd13, Cellar West, and The Post Chicken and Beer, plus the beloved August Peach Festival.",
    highlights: ["Old Town murals", "Craft breweries", "Peach Festival"],
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
      "North of Boulder, Longmont has quietly become Boulder County's hidden dining and craft hub, with a historic Main Street in a certified Creative District. Think Left Hand and Wibby breweries, St. Vrain Cidery, Dryland Distillers, standout pizza and global eats, free parking, and the St. Vrain Greenway, all with space and value Boulder cannot match.",
    highlights: ["Creative District downtown", "Craft beer and dining", "Space and value"],
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
      "The most convenient midpoint between Boulder and Denver, Broomfield sits on the Highway 36 tech corridor, about ten miles from Boulder and the quickest reach to Denver International Airport, roughly forty minutes away. FlatIron Crossing anchors the shopping and dining, backed by more than sixty miles of trails and open space.",
    highlights: ["Central to both cities", "Closest to the airport", "FlatIron Crossing"],
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
      "Colorado's capital sits about forty minutes southeast, an easy day trip up the highway. Base here for world class culture and nightlife, from the Denver Art Museum and the Museum of Nature and Science to Ball Arena, Red Rocks, and a deep restaurant scene, then drive up to the festival.",
    highlights: ["Big city base", "Museums and nightlife", "Day trip to the festival"],
    image: "https://images.unsplash.com/photo-1648441095877-90406e6ba04d?w=1200&q=80",
    mapX: 84,
    mapY: 88,
  },
  {
    slug: "golden",
    name: "Golden",
    description:
      "A historic foothills town where the Rockies meet the plains, known for Coors, Clear Creek, and a walkable Western downtown.",
    overview:
      "About forty minutes south of Boulder, Golden sits in Clear Creek Valley where the Rockies meet the plains. Tour the Coors brewery, the world's largest single site brewery, walk the historic Washington Avenue downtown under its famous welcome arch, tube or kayak Clear Creek, and climb Lookout Mountain to the Buffalo Bill grave. Red Rocks is only about ten miles away.",
    highlights: ["Coors and Clear Creek", "Historic downtown", "Red Rocks nearby"],
    image: "https://images.unsplash.com/photo-1659730251471-1b1dfc88b491?w=1200&q=80",
    mapX: 30,
    mapY: 84,
  },
  {
    slug: "estes-park",
    name: "Estes Park",
    description:
      "The eastern gateway to Rocky Mountain National Park, a classic mountain town of elk, alpine lakes, and the storied Stanley Hotel.",
    overview:
      "About fifty minutes north of Boulder through Lyons and the canyons, Estes Park is the eastern gateway to Rocky Mountain National Park. At 7,500 feet it is all alpine lakes, elk wandering downtown, and the shops and restaurants of Elkhorn Avenue, anchored by the storied Stanley Hotel that inspired The Shining. It makes a spectacular base or a full day escape from the festival.",
    highlights: ["Rocky Mountain National Park", "The Stanley Hotel", "Elk and alpine lakes"],
    image: "https://images.unsplash.com/photo-1508529196090-0a422bcdb8b3?w=1200&q=80",
    mapX: 14,
    mapY: 6,
  },
  {
    slug: "nederland",
    name: "Nederland",
    description:
      "A funky mountain town up Boulder Canyon, gateway to the Peak to Peak Byway, Eldora skiing, and the Indian Peaks.",
    overview:
      "Just a half hour up Boulder Canyon at 8,230 feet, Nederland is a deliberately unpolished mountain town of coffee shops, live music, and the beloved hand carved Carousel of Happiness. It anchors the Peak to Peak Scenic Byway toward Estes Park, sits about five miles from Eldora ski area, and opens onto the Indian Peaks Wilderness. A perfect mountain base or scenic day trip.",
    highlights: ["Carousel of Happiness", "Peak to Peak Byway", "Eldora and Indian Peaks"],
    image: "https://images.unsplash.com/photo-1516644267149-681fb9f0624c?w=1200&q=80",
    mapX: 13,
    mapY: 40,
  },
];

export const getNeighborhood = (slug: string) =>
  neighborhoods.find((n) => n.slug === slug);
