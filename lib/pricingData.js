export const TOOLS = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby:      { label: "Hobby",      pricePerSeat: 0,  maxSeats: 1 },
      pro:        { label: "Pro",        pricePerSeat: 20, maxSeats: null },
      business:   { label: "Business",   pricePerSeat: 40, maxSeats: null },
      enterprise: { label: "Enterprise", pricePerSeat: 60, maxSeats: null },
    },
    useCases: ["coding"],
    sourceUrl: "https://cursor.sh/pricing",
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      individual:  { label: "Individual",  pricePerSeat: 10,  maxSeats: 1 },
      business:    { label: "Business",    pricePerSeat: 19,  maxSeats: null },
      enterprise:  { label: "Enterprise",  pricePerSeat: 39,  maxSeats: null },
    },
    useCases: ["coding"],
    sourceUrl: "https://github.com/features/copilot#pricing",
  },
  claude: {
    name: "Claude",
    plans: {
      free:       { label: "Free",       pricePerSeat: 0,   maxSeats: 1 },
      pro:        { label: "Pro",        pricePerSeat: 20,  maxSeats: 1 },
      max:        { label: "Max",        pricePerSeat: 100, maxSeats: 1 },
      team:       { label: "Team",       pricePerSeat: 30,  maxSeats: null, minSeats: 5 },
      enterprise: { label: "Enterprise", pricePerSeat: 60,  maxSeats: null },
      api:        { label: "API Direct", pricePerSeat: null, variable: true },
    },
    useCases: ["coding", "writing", "research", "data", "mixed"],
    sourceUrl: "https://www.anthropic.com/pricing",
  },
  chatgpt: {
    name: "ChatGPT",
    plans: {
      plus:       { label: "Plus",       pricePerSeat: 20,  maxSeats: 1 },
      team:       { label: "Team",       pricePerSeat: 30,  maxSeats: null, minSeats: 2 },
      enterprise: { label: "Enterprise", pricePerSeat: 50,  maxSeats: null },
      api:        { label: "API Direct", pricePerSeat: null, variable: true },
    },
    useCases: ["coding", "writing", "research", "data", "mixed"],
    sourceUrl: "https://openai.com/chatgpt/pricing",
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: {
      api: { label: "API Direct", pricePerSeat: null, variable: true },
    },
    useCases: ["coding", "writing", "research", "data", "mixed"],
    sourceUrl: "https://www.anthropic.com/pricing",
  },
  openai_api: {
    name: "OpenAI API",
    plans: {
      api: { label: "API Direct", pricePerSeat: null, variable: true },
    },
    useCases: ["coding", "writing", "research", "data", "mixed"],
    sourceUrl: "https://openai.com/api/pricing",
  },
  gemini: {
    name: "Gemini",
    plans: {
      free:     { label: "Free",     pricePerSeat: 0,     maxSeats: 1 },
      advanced: { label: "Advanced", pricePerSeat: 19.99, maxSeats: 1 },
      api:      { label: "API",      pricePerSeat: null,  variable: true },
    },
    useCases: ["coding", "writing", "research", "data", "mixed"],
    sourceUrl: "https://one.google.com/about/ai-premium",
  },
  windsurf: {
    name: "Windsurf",
    plans: {
      free:  { label: "Free",  pricePerSeat: 0,  maxSeats: 1 },
      pro:   { label: "Pro",   pricePerSeat: 15, maxSeats: null },
      teams: { label: "Teams", pricePerSeat: 35, maxSeats: null },
    },
    useCases: ["coding"],
    sourceUrl: "https://codeium.com/windsurf/pricing",
  },
};

// Cheaper alternatives per use case
export const ALTERNATIVES = {
  coding: [
    { tool: "windsurf", plan: "pro",  label: "Windsurf Pro",        price: 15  },
    { tool: "cursor",   plan: "pro",  label: "Cursor Pro",           price: 20  },
    { tool: "github_copilot", plan: "individual", label: "Copilot Individual", price: 10 },
  ],
  writing: [
    { tool: "claude",  plan: "pro",  label: "Claude Pro",  price: 20 },
    { tool: "gemini",  plan: "free", label: "Gemini Free", price: 0  },
  ],
  research: [
    { tool: "claude",  plan: "pro",  label: "Claude Pro",  price: 20 },
    { tool: "gemini",  plan: "free", label: "Gemini Free", price: 0  },
  ],
  data: [
    { tool: "chatgpt", plan: "plus", label: "ChatGPT Plus", price: 20 },
    { tool: "claude",  plan: "pro",  label: "Claude Pro",   price: 20 },
  ],
  mixed: [
    { tool: "claude",  plan: "pro",  label: "Claude Pro",   price: 20 },
    { tool: "chatgpt", plan: "plus", label: "ChatGPT Plus", price: 20 },
  ],
};