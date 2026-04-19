export const CONSTRUCTION_TREE = [
  {
    id: "civil-eng",
    name: "Civil Engineering",
    type: "non-leaf", // Folder
    icon: "🏗️",
    children: [
      {
        id: "foundations",
        name: "Foundations",
        type: "non-leaf",
        children: [
          {
            id: "isolated-footing",
            name: "Isolated Footing",
            type: "leaf", // Calculator Page
            icon: "📐",
            fields: [
              { id: "length", label: "Length (m)", type: "number", unit: "m" },
              { id: "width", label: "Width (m)", type: "number", unit: "m" },
              { id: "height", label: "Height (m)", type: "number", unit: "m" }
            ],
            formula: "L * W * H",
            resultUnit: "m³"
          },
          {
            id: "strip-foundation",
            name: "Strip Foundation",
            type: "leaf",
            icon: "📏",
            fields: [
              { id: "length", label: "Total Length", type: "number", unit: "m" },
              { id: "width", label: "Width", type: "number", unit: "m" }
            ]
          }
        ]
      },
      {
        id: "structure",
        name: "Structure & Concrete",
        type: "non-leaf",
        children: [
          { id: "columns", name: "Reinforced Columns", type: "leaf" },
          { id: "slabs", name: "Concrete Slabs", type: "leaf" }
        ]
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical Systems",
    type: "non-leaf",
    icon: "⚡",
    children: [
      {
        id: "wiring",
        name: "Cabling & Wiring",
        type: "leaf",
        fields: [
          { id: "dist", label: "Distance", type: "number" },
          { id: "load", label: "Load (kW)", type: "number" }
        ]
      }
    ]
  }
];

export const ADMIN_CATEGORY_TREE = [
 {
    id: "civil-eng",
    name: "Civil Engineering",
    type: "non-leaf", // Folder
    icon: "🏗️",
    children: [
      {
        id: "foundations",
        name: "Foundations",
        type: "non-leaf",
        children: [
          {
            id: "isolated-footing",
            name: "Isolated Footing",
            type: "leaf", // Calculator Page
            icon: "📐",
            fields: [
              { id: "length", label: "Length (m)", type: "number", unit: "m" },
              { id: "width", label: "Width (m)", type: "number", unit: "m" },
              { id: "height", label: "Height (m)", type: "number", unit: "m" }
            ],
            formula: "L * W * H",
            resultUnit: "m³"
          },
          {
            id: "strip-foundation",
            name: "Strip Foundation",
            type: "leaf",
            icon: "📏",
            fields: [
              { id: "length", label: "Total Length", type: "number", unit: "m" },
              { id: "width", label: "Width", type: "number", unit: "m" }
            ]
          }
        ]
      },
      {
        id: "structure",
        name: "Structure & Concrete",
        type: "non-leaf",
        children: [
          { id: "columns", name: "Reinforced Columns", type: "leaf" },
          { id: "slabs", name: "Concrete Slabs", type: "leaf" }
        ]
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical Systems",
    type: "non-leaf",
    icon: "⚡",
    children: [
      {
        id: "wiring",
        name: "Cabling & Wiring",
        type: "leaf",
        fields: [
          { id: "dist", label: "Distance", type: "number" },
          { id: "load", label: "Load (kW)", type: "number" }
        ]
      }
    ]
  }
];

