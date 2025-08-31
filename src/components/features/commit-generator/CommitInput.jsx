import { useState } from 'react'

const CommitInput = ({ onGenerate, isGenerating, isAuthenticated, error }) => {
  const [diffInput, setDiffInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(diffInput)
  }

  const getButtonText = () => {
    if (isGenerating) return 'Generating...'
    if (!isAuthenticated) return 'Sign in to Generate'
    return 'Generate Commit Messages'
  }

  const isDisabled = isGenerating || !diffInput.trim() || !isAuthenticated

  return (
    <div className="w-1/2 p-6 border-r border-github-border">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <label htmlFor="diff-input" className="block text-sm font-medium text-github-text-secondary mb-3">
            Paste your <code className="bg-github-bg-tertiary text-github-accent px-2 py-1 rounded text-xs font-mono">git diff --staged</code> output:
          </label>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
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
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isDisabled}
            className="bg-github-accent hover:bg-github-accent-hover disabled:bg-github-border 
                     disabled:cursor-not-allowed disabled:text-github-text-muted text-white 
                     font-medium py-3 px-6 rounded-md transition duration-200 border border-github-accent 
                     hover:border-github-accent-hover disabled:border-github-border"
          >
            {getButtonText()}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CommitInput