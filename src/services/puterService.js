import { API_CONFIG } from "../constants/app.js";

class PuterService {
  constructor() {
    this.isInitialized = false;
    this.authCallbacks = new Set();
  }

  // Initialize Puter SDK with error handling
  async initialize() {
    if (this.isInitialized) return true;

    try {
      if (typeof window.puter === "undefined") {
        throw new Error("Puter SDK not loaded");
      }
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize Puter SDK:", error);
      return false;
    }
  }

  // Authentication methods
  async checkAuthStatus() {
    await this.initialize();

    try {
      const isSignedIn = await window.puter.auth.isSignedIn();
      this.notifyAuthCallbacks(isSignedIn);
      return isSignedIn;
    } catch (error) {
      console.error("Failed to check auth status:", error);
      return false;
    }
  }

  async signIn() {
    await this.initialize();

    try {
      await window.puter.auth.signIn();
      this.notifyAuthCallbacks(true);
      return true;
    } catch (error) {
      console.error("Sign in failed:", error);
      // Fallback to Puter website
      window.open("https://puter.com/app", "_blank");
      return false;
    }
  }

  async signOut() {
    await this.initialize();

    try {
      await window.puter.auth.signOut();
      this.notifyAuthCallbacks(false);
      return true;
    } catch (error) {
      console.error("Sign out failed:", error);
      return false;
    }
  }

  // AI methods
  async generateCommitMessages(gitDiff, options = {}) {
    await this.initialize();

    const { maxMessages = 5 } = options;

    const prompt = this.buildCommitPrompt(gitDiff, maxMessages);

    try {
      const response = await window.puter.ai.chat(prompt);
      return this.parseCommitResponse(response, maxMessages);
    } catch (error) {
      console.error("AI generation failed:", error);
      throw new Error(`Failed to generate commit messages: ${error.message}`);
    }
  }

  // Private helper methods
  buildCommitPrompt(gitDiff, maxMessages) {
    return `You are a git commit message generator. Analyze this git diff and generate exactly ${maxMessages} concise, conventional commit messages. Each should be under 72 characters and follow the format: type(scope): description

Examples: feat(auth): add user login validation, fix(ui): correct button alignment, docs: update API documentation

Git diff to analyze:
${gitDiff}

Return only the ${maxMessages} commit messages, one per line, without numbering or extra text.`;
  }

  parseCommitResponse(response, maxMessages) {
    // Handle different response formats
    let responseText = "";
    if (typeof response === "string") {
      responseText = response;
    } else if (response && typeof response.text === "string") {
      responseText = response.text;
    } else if (response && typeof response.content === "string") {
      responseText = response.content;
    } else {
      responseText = String(response);
    }

    const messages = responseText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .slice(0, maxMessages);

    if (messages.length === 0) {
      throw new Error("No valid commit messages generated");
    }

    return messages;
  }

  // Auth callback system
  onAuthChange(callback) {
    this.authCallbacks.add(callback);

    // Return cleanup function
    return () => {
      this.authCallbacks.delete(callback);
    };
  }

  notifyAuthCallbacks(isAuthenticated) {
    this.authCallbacks.forEach((callback) => {
      try {
        callback(isAuthenticated);
      } catch (error) {
        console.error("Auth callback error:", error);
      }
    });
  }
}

// Export singleton instance
export const puterService = new PuterService();
export default puterService;
