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
    min: 2,
    max: 8,
  },
  animationDelays: {
    typewriter: 150,
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
  maxCommitMessages: 8,
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1280px",
  },
};

export const SAMPLE_GIT_DIFF = `diff --git a/src/components/Button.jsx b/src/components/Button.jsx
index 1234567..abcdefg 100644
--- a/src/components/Button.jsx
+++ b/src/components/Button.jsx
@@ -1,5 +1,8 @@
 export function Button({ children, onClick }) {
   return (
-    <button onClick={onClick}>
+    <button
+      onClick={onClick}
+      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
+    >
       {children}
     </button>
   )
 }`;
