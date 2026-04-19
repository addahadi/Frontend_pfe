// src/modules/user/mocks/user.mock.js
export const MOCK_PROJECTS = [
  {
    id: "skyline-tower",
    name: "Skyline Tower",
    client: "Apex Corp",
    dueDate: "Dec 2024",
    description: "High-rise luxury residential complex with sustainable architecture and smart energy...",
    status: "active",
    totalCalculations: 142,
    activeCategories: 3,
    uuid: "8f2d-4b9a",
    manager: "Alex Morgan",
  },
  {
    id: "riverfront-plaza",
    name: "Riverfront Plaza",
    client: "Metro City",
    dueDate: "Mar 2025",
    description: "Public-private partnership for waterfront development including recreational and office...",
    status: "active",
    totalCalculations: 89,
    activeCategories: 2,
    uuid: "8f2-a91",
    manager: "Sarah Lee",
  },
  {
    id: "oakwood-medical",
    name: "Oakwood Medical",
    client: "HealthFirst",
    dueDate: "Mar 2025",
    description: "State-of-the-art medical facility focusing on diagnostic excellence and patient comfort.",
    status: "active",
    totalCalculations: 210,
    activeCategories: 4,
    uuid: "oak-123",
    manager: "Dr. Smith",
  },
];
export const MOCK_CATEGORIES = {
  "skyline-tower": [
    { id: "grand-travaux", name: "Grand Travaux", count: 58, icon: "🏗️", description: "Major structural works", sub: ["EXCAVATION", "FOUNDATIONS", "COLUMNS"] },
    { id: "finition", name: "Finition", count: 42, icon: "🎨", description: "Finishing & surface works", sub: ["TILING", "PAINTING", "CEILING"] },
    { id: "portes-fenetres", name: "Portes & Fenêtres", count: 42, icon: "🚪", description: "Doors & windows", sub: ["WINDOWS", "MAIN DOORS", "INTERNAL DOORS"] },
  ],
};

export const MOCK_RECENT_CALCS = {
  "skyline-tower": [
    { id: 1, category: "Grand Travaux", element: "Isolated Footing #12", keyResult: "3.75 m³", timestamp: "2 mins ago" },
    { id: 2, category: "Portes & Fenêtres", element: "Main Entrance Glass", keyResult: "12.40 m²", timestamp: "45 mins ago" },
    { id: 3, category: "Finition", element: "Lobby Wall Coating", keyResult: "450.00 m²", timestamp: "2 hours ago" },
  ],
};

export const MOCK_ARTICLES = {
  saved: [
    { id: 1, title: "Sustainable Concrete Trends", type: "BLOG", status: "PUBLISHED" },
    { id: 2, title: "2024 Safety Regulations", type: "ACTUALITE", status: "DRAFT" },
    { id: 3, title: "BIM Integration 101", type: "BLOG", status: "PUBLISHED" },
  ],
  liked: [
    { id: 4, title: "Cost Optimization Hacks", type: "ACTUALITE", status: "PUBLISHED" },
    { id: 5, title: "Urban Development News", type: "ACTUALITE", status: "PUBLISHED" },
  ],
};

export const MOCK_USER = {
  fullName: "John Doe",
  email: "john.doe@quanticconstruct.com",
  role: "SENIOR PROJECT MANAGER",
  plan: "Pro Analytics Plus",
  billingCycle: "Annual",
  periodStart: "Jan 01, 2024",
  periodEnd: "Jan 01, 2025",
  limits: {
    projectsCreated: 3,
    projectsMax: 20,
    aiRequestsUsed: 45,
    aiRequestsMax: 500,
    teamSeats: 25,
  },
};