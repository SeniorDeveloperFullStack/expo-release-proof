export type Property = {
  slug: string;
  name: string;
  eyebrow: string;
  location: string;
  region: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  rating: string;
  reviews: number;
  description: string;
  longDescription: string;
  hero: string;
  images: string[];
  amenities: string[];
  highlights: string[];
};

export const properties: Property[] = [
  {
    slug: "casa-alba",
    name: "Casa Alba",
    eyebrow: "Desert sanctuary",
    location: "Joshua Tree, California",
    region: "High Desert",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    price: 425,
    rating: "4.98",
    reviews: 87,
    description: "A sculptural desert retreat with endless skies, a private pool, and quiet mornings.",
    longDescription: "Casa Alba is a sun-washed hideaway designed for slow days and star-filled nights. Floor-to-ceiling glass frames the raw desert landscape, while hand-finished plaster walls, linen textures, and warm oak create a calm, tactile interior.",
    hero: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1800&q=85",
    images: [
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
    ],
    amenities: ["Private pool", "Outdoor firepit", "Chef's kitchen", "EV charger", "Fast Wi-Fi", "Desert views", "Outdoor shower", "Record player"],
    highlights: ["Sunset pool deck", "10 minutes to the park", "Stargazing courtyard"]
  },
  {
    slug: "tide-house",
    name: "Tide House",
    eyebrow: "Oceanfront escape",
    location: "Cannon Beach, Oregon",
    region: "Oregon Coast",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    price: 610,
    rating: "4.96",
    reviews: 64,
    description: "A refined coastal home where cedar, stone, and panoramic Pacific views meet.",
    longDescription: "Tide House sits just above the shoreline, bringing the rhythm of the Pacific into every room. Gather around the stone fireplace, cook with the sea in view, or follow the private path down to the sand.",
    hero: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1800&q=85",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
    ],
    amenities: ["Oceanfront", "Hot tub", "Wood fireplace", "Private beach path", "Chef's kitchen", "Fast Wi-Fi", "Game room", "Washer & dryer"],
    highlights: ["Private beach access", "Panoramic ocean views", "Cozy fireside evenings"]
  },
  {
    slug: "pine-and-peak",
    name: "Pine & Peak",
    eyebrow: "Mountain hideaway",
    location: "Big Sky, Montana",
    region: "Rocky Mountains",
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    price: 780,
    rating: "5.0",
    reviews: 42,
    description: "A modern alpine lodge made for powder days, fireside evenings, and mountain air.",
    longDescription: "Pine & Peak balances grand mountain views with deeply comfortable spaces. Natural stone, blackened steel, and soft wool make this a true four-season basecamp with room for the whole group.",
    hero: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1800&q=85",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85"
    ],
    amenities: ["Mountain views", "Hot tub", "Ski storage", "Indoor fireplace", "Chef's kitchen", "Sauna", "Fast Wi-Fi", "Heated floors"],
    highlights: ["15 minutes to Big Sky", "Private cedar sauna", "Floor-to-ceiling views"]
  },
  {
    slug: "olive-cottage",
    name: "Olive Cottage",
    eyebrow: "Wine country retreat",
    location: "Sonoma, California",
    region: "Wine Country",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    price: 495,
    rating: "4.99",
    reviews: 103,
    description: "An intimate cottage wrapped in olive trees, with a pool and space to exhale.",
    longDescription: "Tucked between old olive trees and rolling vineyards, Olive Cottage is a restorative wine country stay. French doors open to a private garden, a plunge pool, and long-table dinners beneath the trees.",
    hero: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=85",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
    ],
    amenities: ["Private pool", "Outdoor dining", "Garden", "Indoor fireplace", "Full kitchen", "Fast Wi-Fi", "Bikes", "Vineyard views"],
    highlights: ["Minutes from wineries", "Private olive grove", "Garden plunge pool"]
  }
];

export const getProperty = (slug: string) => properties.find((property) => property.slug === slug);
