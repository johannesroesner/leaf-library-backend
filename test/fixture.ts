import type { NewUser } from "../src/model/interface/user.js";
import { NewPlant } from "../src/model/interface/plant";
import { NewCollection } from "../src/model/interface/collection";

export const serviceUrl: string = "http://localhost:3000";

export const newTestUsers: NewUser[] = [
  {
    email: "sheldon.cooper@caltechmail.com",
    firstName: "Sheldon",
    secondName: "Cooper",
    password: "Bazinga123!",
  },
  {
    email: "leonard.hofstadter@physicsmail.org",
    firstName: "Leonard",
    secondName: "Hofstadter",
    password: "Roommate456!",
  },
  {
    email: "howard.wolowitz@aerospacehub.net",
    firstName: "Howard",
    secondName: "Wolowitz",
    password: "Rocket789!",
  },
  {
    email: "raj.koothrappali@cosmosmail.io",
    firstName: "Raj",
    secondName: "Koothrappali",
    password: "Astro321!",
  },
];

export const newTestPlants: NewPlant[] = [
  {
    commonName: "Sunflower",
    scientificName: "Helianthus annuus",
    type: "Flower",
    biome: "Meadow",
    imageUrls: ["https://example.com/sunflower.jpg"],
    note: "Grows tall and loves sunlight",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    commonName: "Oak Tree",
    scientificName: "Quercus robur",
    type: "Tree",
    biome: "Forest",
    imageUrls: ["https://example.com/oak.jpg"],
    note: "Can live for hundreds of years",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    commonName: "Water Lily",
    scientificName: "Nymphaea alba",
    type: "Aquatic Plant",
    biome: "Pond",
    imageUrls: ["https://example.com/waterlily.jpg"],
    note: "Floats on water, blooms in summer",
    latitude: 45.4215,
    longitude: -75.6972,
  },
  {
    commonName: "Ivy",
    scientificName: "Hedera helix",
    type: "Climber",
    biome: "Urban",
    imageUrls: ["https://example.com/ivy.jpg"],
    note: "Climbs walls and fences",
    latitude: 40.7128,
    longitude: -74.006,
  },
];

export const newTestCollections: NewCollection[] = [
  {
    name: "Summer Garden",
    description: "A collection of my favorite summer plants",
    imageUrl: "https://example.com/summer-garden.jpg",
  },
  {
    name: "Indoor Greens",
    description: "Plants that thrive indoors",
    imageUrl: null,
  },
  {
    name: "Medicinal Herbs",
    description: "Herbs for teas and remedies",
    imageUrl: "https://example.com/herbs.jpg",
  },
  {
    name: "Succulent Paradise",
    description: "A lot of succulents",
    imageUrl: "https://example.com/succulents.jpg",
  },
];
