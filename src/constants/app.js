// Application constants
export const APP_CONFIG = {
  name: "Git Commit Writer",
  version: "1.0.0",
  description: "Generate professional git commit messages using AI",
  repository: "https://github.com/ayced31/git-commit-writer",
};

export const API_CONFIG = {
  maxInputSize: 50000,
  typingSpeed: {
    min: 15,
    max: 25,
  },
  animationDelays: {
    typewriter: 300,
    cursor: 400,
    authCheck: 1000,
  },
};

export const VALIDATION_RULES = {
  gitDiff: {
    required: ["diff --git", "---", "+++"],
    hunkPattern: /@@ -\d+,\d+ \+\d+,\d+ @@/,
    changeMarkers: ["+", "-"],
  },
};

export const UI_CONSTANTS = {
  commitMessageLimit: 72,
  maxCommitMessages: 5,
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1280px",
  },
};
