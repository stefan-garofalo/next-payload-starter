const capabilityPacks = {
  "effect": {
    "description": "Effect v4 pack: programs, schemas, HTTP clients, and service/Layer design.",
    "skills": [
      "effect",
      "effect-service-design"
    ]
  },
  "research": {
    "description": "Default research pack: parallel research, structured review, and architecture inspection.",
    "skills": [
      "parallel-research",
      "review-phase",
      "improve-codebase-architecture"
    ]
  },
  "frontend": {
    "description": "Frontend pack: agent-browser, design taste, and frontend domain structure.",
    "skills": [
      "agent-browser",
      "design-taste-frontend",
      "frontend-domain-structure"
    ]
  },
  "nextjs": {
    "description": "Next.js guidance pack.",
    "skills": [
      "next-best-practices",
      "next-cache-components"
    ]
  },
  "quality": {
    "description": "Default quality pack: tdd, simplify.",
    "skills": [
      "tdd",
      "simplify"
    ]
  },
  "react": {
    "description": "React guidance pack.",
    "skills": [
      "async-react-patterns",
      "vercel-composition-patterns",
      "vercel-react-best-practices"
    ]
  },
  "tanstack-query": {
    "description": "TanStack Query guidance pack.",
    "skills": [
      "tanstack-query"
    ]
  },
  "typescript": {
    "description": "Shared JavaScript / TypeScript language pack for hook and language-level scaffold assets.",
    "skills": [
      "quality-types"
    ]
  }
};
const agents = [
  {
    "name": "code-review",
    "description": "Use for findings-first review across changed code, simplification opportunities, and grounded architecture-friction findings.",
    "ownedPaths": [
      "**/*"
    ],
    "guidanceFiles": [
      "AGENTS.md"
    ],
    "activationInstructions": [
      "Before planning or editing, read every file in `guidanceFiles` for this role, then `.agents/rules/index.md`.",
      "In each scoped AGENTS.md, use the `## Skills` table: activate every skill whose exact trigger matches the task by opening its SKILL.md and applying it before edits.",
      "Apply every Rule Registry rule whose path or task trigger matches, and record it as pass, fail, or not-applicable.",
      "If the task touches multiple scopes, read each scope's nearest AGENTS.md and activate the union of matching skills."
    ],
    "packs": [
      "research"
    ],
    "skills": [
      "simplify",
      "improve-codebase-architecture"
    ],
    "boundaries": [
      "Operate only inside the assigned owned paths unless the parent explicitly expands scope.",
      "If the task clearly belongs to another specialist, say so explicitly instead of improvising outside your scope.",
      "If the task changes architecture, setup, contracts, decisions, or operator workflow, update the relevant docs or runbook in the same task."
    ]
  },
  {
    "name": "app",
    "description": "Own implementation in the root Next.js + Payload app under src/ and root config; defer wiki work to the wiki agent.",
    "ownedPaths": [
      "**/*"
    ],
    "guidanceFiles": [
      "AGENTS.md",
      "src/AGENTS.md"
    ],
    "activationInstructions": [
      "Before planning or editing, read every file in `guidanceFiles` for this role, then `.agents/rules/index.md`.",
      "In each scoped AGENTS.md, use the `## Skills` table: activate every skill whose exact trigger matches the task by opening its SKILL.md and applying it before edits.",
      "Apply every Rule Registry rule whose path or task trigger matches, and record it as pass, fail, or not-applicable.",
      "If the task touches multiple scopes, read each scope's nearest AGENTS.md and activate the union of matching skills."
    ],
    "packs": [
      "effect",
      "frontend",
      "nextjs",
      "quality",
      "react",
      "tanstack-query",
      "typescript"
    ],
    "skills": [
      "agent-browser",
      "animate",
      "async-react-patterns",
      "design-taste-frontend",
      "effect",
      "effect-service-design",
      "frontend-domain-structure",
      "mobile-native",
      "next-best-practices",
      "next-cache-components",
      "payload",
      "quality-types",
      "react-doctor",
      "review-animations",
      "shadcn",
      "simplify",
      "tanstack-query",
      "tdd",
      "vercel-composition-patterns",
      "vercel-react-best-practices"
    ],
    "boundaries": [
      "Operate only inside the assigned owned paths unless the parent explicitly expands scope.",
      "If the task clearly belongs to another specialist, say so explicitly instead of improvising outside your scope.",
      "If the task changes architecture, setup, contracts, decisions, or operator workflow, update the relevant docs or runbook in the same task."
    ]
  },
  {
    "name": "wiki",
    "description": "Own changes under wiki and defer cross-workspace orchestration to the root agent.",
    "ownedPaths": [
      "wiki",
      "wiki/**"
    ],
    "guidanceFiles": [
      "wiki/AGENTS.md"
    ],
    "activationInstructions": [
      "Before planning or editing, read every file in `guidanceFiles` for this role, then `.agents/rules/index.md`.",
      "In each scoped AGENTS.md, use the `## Skills` table: activate every skill whose exact trigger matches the task by opening its SKILL.md and applying it before edits.",
      "Apply every Rule Registry rule whose path or task trigger matches, and record it as pass, fail, or not-applicable.",
      "If the task touches multiple scopes, read each scope's nearest AGENTS.md and activate the union of matching skills."
    ],
    "packs": [
      "frontend",
      "nextjs",
      "quality",
      "react",
      "research",
      "tanstack-query",
      "typescript"
    ],
    "skills": [
      "agent-browser",
      "design-taste-frontend",
      "domain-modeling",
      "next-best-practices",
      "simplify",
      "vercel-composition-patterns",
      "vercel-react-best-practices",
      "writing-for-agents"
    ],
    "boundaries": [
      "Operate only inside the assigned owned paths unless the parent explicitly expands scope.",
      "If the task clearly belongs to another specialist, say so explicitly instead of improvising outside your scope.",
      "If the task changes architecture, setup, contracts, decisions, or operator workflow, update the relevant docs or runbook in the same task."
    ]
  }
];
export { agents, capabilityPacks };
