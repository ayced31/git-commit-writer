import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TypewriterEffect from './components/TypewriterEffect'

function App() {
  const [diffInput, setDiffInput] = useState('')
  const [commitMessages, setCommitMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [showTypewriter, setShowTypewriter] = useState(true)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  const validateGitDiff = (input) => {
    const trimmed = input.trim()
    
    // Check for empty input
    if (!trimmed) {
      return { valid: false, error: 'Please paste your git diff output first' }
    }
    
    // Check for basic git diff markers
    const hasGitDiffHeader = /^diff --git/.test(trimmed) || trimmed.includes('diff --git')
    const hasFileMarkers = trimmed.includes('---') && trimmed.includes('+++')
    const hasHunkHeaders = /@@ -\d+,\d+ \+\d+,\d+ @@/.test(trimmed)
    const hasChanges = trimmed.includes('+') || trimmed.includes('-')
    
    // Must have at least git diff header or file markers
    if (!hasGitDiffHeader && !hasFileMarkers) {
      return { 
        valid: false, 
        error: 'Input doesn\'t appear to be git diff output. Please use "git diff --staged" command.' 
      }
    }
    
    // Warning for potentially incomplete diff
    if (hasFileMarkers && !hasHunkHeaders && !hasChanges) {
      return {
        valid: true,
        warning: 'This appears to be a diff with no actual changes. Results may not be meaningful.'
      }
    }
    
    return { valid: true }
  }

  const sanitizeInput = (input) => {
    // Remove potentially harmful content while preserving diff structure
    return input
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .slice(0, 50000) // Limit input size to prevent abuse
  }

  const generateCommitMessage = async () => {
    if (!isUserAuthenticated) {
      setError('Please sign in with Puter to use AI features')
      return
    }
    
    const validation = validateGitDiff(diffInput)
    
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      // Check if Puter is available
      if (typeof window.puter === 'undefined') {
        throw new Error('Puter SDK not loaded. Please refresh the page.')
      }

      const sanitizedInput = sanitizeInput(diffInput)
      
      const prompt = `You are a git commit message generator. Analyze this git diff and generate exactly 3 concise, conventional commit messages. Each should be under 72 characters and follow the format: type(scope): description

Examples: feat(auth): add user login validation, fix(ui): correct button alignment, docs: update API documentation

Git diff to analyze:
${sanitizedInput}

${validation.warning ? `Note: ${validation.warning}` : ''}

Return only the 3 commit messages, one per line, without numbering or extra text.`

      const response = await window.puter.ai.chat(prompt)
      
      // Handle different response formats
      let responseText = ''
      if (typeof response === 'string') {
        responseText = response
      } else if (response && typeof response.text === 'string') {
        responseText = response.text
      } else if (response && typeof response.content === 'string') {
        responseText = response.content
      } else {
        responseText = String(response)
      }
      
      const messages = responseText.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3) // Ensure we only get 3 messages
      
      if (messages.length === 0) {
        throw new Error('No valid commit messages generated')
      }
      
      setCommitMessages(messages)
    } catch (err) {
      setError(`Failed to generate commit messages: ${err.message}`)
      console.error('AI generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (message) => {
    try {
      await navigator.clipboard.writeText(message)
      // Optional: Show success feedback
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const CopyIcon = () => (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
      />
    </svg>
  )

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

  const handleTypewriterComplete = () => {
    setTypewriterComplete(true)
  }

  useEffect(() => {
    if (commitMessages.length > 0) {
      setShowTypewriter(false)
    }
  }, [commitMessages])

  const handleAuthChange = (isAuthenticated) => {
    setIsUserAuthenticated(isAuthenticated)
  }

  return (
    <div className="h-screen flex flex-col bg-github-bg text-github-text">
      <Navbar onAuthChange={handleAuthChange} />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Input */}
        <div className="w-1/2 p-6 border-r border-github-border">
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <label htmlFor="diff-input" className="block text-sm font-medium text-github-text-secondary mb-3">
                Paste your <code className="bg-github-bg-tertiary text-github-accent px-2 py-1 rounded text-xs font-mono">git diff --staged</code> output:
              </label>
            </div>
            
            <div className="flex-1 flex flex-col">
              <textarea
                id="diff-input"
                value={diffInput}
                onChange={(e) => setDiffInput(e.target.value)}
                placeholder="diff --git a/src/components/Button.jsx b/src/components/Button.jsx
index 1234567..abcdefg 100644
--- a/src/components/Button.jsx
+++ b/src/components/Button.jsx
@@ -1,5 +1,8 @@
 export function Button({ children, onClick }) {
   return (
-    <button onClick={onClick}>
+    <button 
+      onClick={onClick}
+      className='px-4 py-2 bg-blue-500 text-white rounded'
+    >
       {children}
     </button>
..."
                className="flex-1 p-3 font-mono text-sm bg-github-bg-secondary border border-github-border rounded-md resize-none 
                         focus:outline-none focus:border-github-blue focus:ring-1 focus:ring-github-blue 
                         text-github-text placeholder-github-text-muted mb-4"
              />
              
              {error && (
                <div className="bg-github-danger/10 border border-github-danger/30 text-github-danger px-4 py-3 rounded-md mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <button
                onClick={generateCommitMessage}
                disabled={isGenerating || !diffInput.trim() || !isUserAuthenticated}
                className="bg-github-accent hover:bg-github-accent-hover disabled:bg-github-border 
                         disabled:cursor-not-allowed disabled:text-github-text-muted text-white 
                         font-medium py-3 px-6 rounded-md transition duration-200 border border-github-accent 
                         hover:border-github-accent-hover disabled:border-github-border"
              >
                {isGenerating ? 'Generating...' : !isUserAuthenticated ? 'Sign in to Generate' : 'Generate Commit Messages'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="w-1/2 p-6">
          <div className="h-full">
            {showTypewriter && commitMessages.length === 0 ? (
              <TypewriterEffect 
                texts={typewriterTexts} 
                onComplete={handleTypewriterComplete}
              />
            ) : (
              <div className="h-full overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-github-text mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-github-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Generated Commit Messages
                  </h2>
                  
                  <div className="space-y-3">
                    {commitMessages.map((message, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-github-bg-secondary 
                                               border border-github-border rounded-md hover:border-github-border-muted transition-colors">
                        <code className="font-mono text-sm flex-1 mr-4 text-github-text">{message}</code>
                        <button
                          onClick={() => copyToClipboard(message)}
                          className="p-2 text-github-text-secondary hover:text-github-text hover:bg-github-border-muted 
                                   rounded-md transition duration-200 flex items-center justify-center"
                          title="Copy to clipboard"
                        >
                          <CopyIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {commitMessages.length > 0 && (
                  <button 
                    onClick={() => {
                      setCommitMessages([])
                      setShowTypewriter(true)
                      setTypewriterComplete(false)
                    }}
                    className="text-github-text-secondary hover:text-github-text text-sm transition-colors"
                  >
                    ← Generate new messages
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default App