# Git Commit Writer

A modern React application that helps developers generate professional git commit messages from their staged changes using AI. Built with React, Vite, Tailwind CSS, and powered by Puter-JS for AI capabilities.

## Features

-  **AI-Powered Commit Messages**: Generate conventional commit messages from git diffs
-  **Secure Authentication**: Sign in with Puter to access AI features
-  **Input Validation**: Validates git diff format and sanitizes input
-  **GitHub-Style Theme**: Dark theme matching GitHub's design system
-  **CLI-Style Typewriter Effect**: Interactive onboarding experience
-  **Copy to Clipboard**: Easy copying of generated commit messages

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **AI Services**: Puter-JS SDK
- **Authentication**: Puter Auth

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayced31/git-commit-writer.git
   cd git-commit-writer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Sign In**: Click "Sign in with Puter" in the top-right corner
2. **Paste Git Diff**: Copy your `git diff --staged` output into the left panel
3. **Generate**: Click "Generate Commit Messages" to get AI-powered suggestions
4. **Copy**: Click the copy icon next to any generated message to copy it to your clipboard

### Example Git Diff Input

```diff
diff --git a/src/components/Button.jsx b/src/components/Button.jsx
index 1234567..abcdefg 100644
--- a/src/components/Button.jsx
+++ b/src/components/Button.jsx
@@ -1,5 +1,8 @@
 export function Button({ children, onClick }) {
   return (
-    <button onClick={onClick}>
+    <button 
+      onClick={onClick}
+      className="px-4 py-2 bg-blue-500 text-white rounded"
+    >
       {children}
     </button>
```

## Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with GitHub-style colors:

- `github-bg`: Main background color
- `github-bg-secondary`: Secondary panels
- `github-border`: Border colors
- `github-text`: Text colors with various opacity levels
- `github-accent`: Green accent color
- `github-danger`: Red colors for actions

### Puter-JS Integration

The app uses Puter-JS for:
- User authentication (`puter.auth.signIn()`)
- AI chat functionality (`puter.ai.chat()`)
- No API keys required - users pay for their own usage
