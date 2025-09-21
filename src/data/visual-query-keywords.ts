export type VisualQueryCategory =
  | "timeline/roadmap"
  | "funnel"
  | "pyramid"
  | "bullseye/target"
  | "venn"
  | "fishbone/ishikawa"
  | "chart/graph"
  | "gauges/meters"
  | "gears/mechanical"
  | "pillars/columns"
  | "decision/branches/tree"
  | "matrix/grid/table"
  | "mind map"
  | "radial/hub/spoke"
  | "cycle/loop"
  | "comparison"
  | "flow/process"
  | "steps/stairs/sequence"
  | "list/cards"
  | "arrows"
  | "chain/link"
  | "hexagon/honeycomb"
  | "currency/symbol"
  | "metaphor/symbolic"
  | "other";

// Aggregated (string) keywords derived from scripts/categorize-visual-variations.cjs rules
export const visualQueryKeywordsByCategory: Record<Exclude<VisualQueryCategory, "other">, string[]> = {
  "timeline/roadmap": [
    "timeline",
    "chronology",
    "journey",
    "roadmap",
    "road",
    "milestone",
    "pin-markers",
    "event-cards",
    "timeline cards",
  ],
  "funnel": [
    "funnel",
    "megaphone",
    "filter",
    "cone",
    "domino-funnel",
    "funnel-cone",
    "cone-funnel",
  ],
  "pyramid": [
    "pyramid",
    "hierarchy",
  ],
  "bullseye/target": [
    "bullseye",
    "target",
    "dartboard",
    "darts",
  ],
  "venn": [
    "venn",
  ],
  "fishbone/ishikawa": [
    "fishbone",
    "ishikawa",
  ],
  "chart/graph": [
    "bar chart",
    "barchart",
    "gantt",
    "line graph",
    "chart",
    "graph",
    "cylindrical bar chart",
    "annotation chart",
  ],
  "gauges/meters": [
    "gauge",
    "thermometer",
    "meter",
    "dial",
  ],
  "gears/mechanical": [
    "gear",
    "gears",
    "mechanical",
  ],
  "pillars/columns": [
    "pillar",
    "pillars",
    "column",
    "columns",
  ],
  "decision/branches/tree": [
    "decision",
    "branch",
    "branches",
    "tree",
    "root-cause",
  ],
  "matrix/grid/table": [
    "matrix",
    "grid",
    "table",
    "row",
    "rows",
    "col",
    "cols",
    "quadrant",
    "quadrants",
  ],
  "mind map": [
    "mind map",
    "mindmap",
  ],
  "radial/hub/spoke": [
    "radial",
    "hub",
    "spoke",
    "orbit",
    "orbital",
    "atomic",
    "atom",
    "ray",
    "pinwheel",
  ],
  "cycle/loop": [
    "cycle",
    "loop",
    "ring",
    "donut",
    "doughnut",
    "infinite",
    "infinity",
  ],
  "comparison": [
    "comparison",
    "versus",
    "vs",
    "contrast",
    "side-by-side",
    "seesaw",
    "balance",
  ],
  "flow/process": [
    "flow",
    "flow chart",
    "flowchart",
    "process",
    "pipeline",
    "lane",
    "lanes",
    "workflow",
  ],
  "steps/stairs/sequence": [
    "step",
    "steps",
    "stair",
    "staircase",
    "sequence",
    "sequenced",
    "bookmark",
    "bookmarks",
    "ladder",
    "progression",
  ],
  "list/cards": [
    "list",
    "card",
    "cards",
    "agenda",
    "tab",
    "tabs",
    "checklist",
  ],
  "arrows": [
    "arrow",
    "arrows",
  ],
  "chain/link": [
    "chain",
    "interlock",
    "interlocked",
    "interlocking",
    "linked",
    "link",
  ],
  "hexagon/honeycomb": [
    "hexagon",
    "hexagonal",
    "honeycomb",
  ],
  "currency/symbol": [
    "dollar",
    "rupee",
    "yen",
    "euro",
    "pound",
    "currency",
    "bitcoin",
  ],
  "metaphor/symbolic": [
    "metaphor",
    "iceberg",
    "mountain",
    "bridge",
    "house",
    "lighthouse",
    "keyring",
    "key",
    "pencil",
    "magnet",
    "brain",
    "cactus",
    "garlic",
    "volcano",
    "rocket",
    "trophy",
    "book",
    "books",
    "fireplace",
    "dna",
    "bucket",
    "windmill",
    "compass",
    "hand",
    "lightbulb",
    "bulb",
    "spotlight",
    "tape",
    "domino",
    "hose",
    "bowling",
    "jenga",
    "gem",
    "onion",
    "crane",
    "puzzle",
    "iceberg-volcano",
    "volcano-iceberg",
  ],
};

export const allVisualQueryKeywords: string[] = Array.from(
  new Set(Object.values(visualQueryKeywordsByCategory).flat())
);
