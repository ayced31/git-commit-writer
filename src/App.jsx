import { useState, useEffect } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'

// Feature Components
import CommitInput from './components/features/commit-generator/CommitInput.jsx'
import CommitResults from './components/features/commit-generator/CommitResults.jsx'
import TypewriterEffect from './components/features/onboarding/TypewriterEffect.jsx'

// UI Components
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

// Hooks
import { useAuth } from './hooks/useAuth.js'
import { useCommitGenerator } from './hooks/useCommitGenerator.js'

// Constants
import { APP_CONFIG } from './constants/app.js'

function App() {
  const [showTypewriter, setShowTypewriter] = useState(true)
  const [typewriterComplete, setTypewriterComplete] = useState(false)

  // Custom hooks for state management
  const { isAuthenticated } = useAuth()
  const { 
    isGenerating, 
    commitMessages, 
    error, 
    generateCommitMessages, 
    clearResults,
    hasResults 
  } = useCommitGenerator()

  // Typewriter content
  const typewriterTexts = [
    "Welcome to Git Commit Writer",
    "",
    "This tool helps you generate professional commit messages from your git diffs.",
    "",
    "To get started, you'll need to sign in with your Puter account.",
    "Puter provides free AI services - you only pay for what you use.",
    "",
    "Once you're ready:",
    "1. Paste your 'git diff --staged' output in the left panel",
    "2. Click 'Generate Commit Messages'",
    "3. Copy your favorite suggestion",
    "",
    "Let's create better commit messages together."
  ]

  // Event handlers
  const handleGenerate = (diffInput) => {
    generateCommitMessages(diffInput, isAuthenticated)
  }

  const handleClearResults = () => {
    clearResults()
    setShowTypewriter(true)
    setTypewriterComplete(false)
  }

  const handleTypewriterComplete = () => {
    setTypewriterComplete(true)
  }

  // Hide typewriter when results are available
  useEffect(() => {
    if (hasResults) {
      setShowTypewriter(false)
    }
  }, [hasResults])

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-github-bg text-github-text">
        <Navbar />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel - Input */}
          <CommitInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            isAuthenticated={isAuthenticated}
            error={error}
          />

          {/* Right Panel - Content */}
          <div className="w-1/2 p-6">
            <div className="h-full">
              {showTypewriter && !hasResults ? (
                <TypewriterEffect 
                  texts={typewriterTexts} 
                  onComplete={handleTypewriterComplete}
                />
              ) : (
                <CommitResults
                  messages={commitMessages}
                  onClear={handleClearResults}
                />
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App