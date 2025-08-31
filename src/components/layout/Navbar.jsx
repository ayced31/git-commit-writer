import { useAuth } from '../../hooks/useAuth.js'
import { APP_CONFIG } from '../../constants/app.js'

const Navbar = () => {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth()

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 text-github-text-secondary text-sm px-3 py-2">
          <div className="animate-spin w-4 h-4 border border-github-border border-t-github-accent rounded-full" />
          <span>Checking...</span>
        </div>
      )
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-github-accent text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Connected to Puter</span>
          </div>
          <button
            onClick={signOut}
            className="text-github-danger hover:text-github-danger-hover text-sm transition-colors px-3 py-1 border border-github-danger hover:border-github-danger-hover rounded-md"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      )
    }

    return (
      <button
        onClick={signIn}
        className="flex items-center space-x-2 bg-github-accent hover:bg-github-accent-hover text-white text-sm px-3 py-2 rounded-md transition-colors"
        title="Sign in with Puter to use AI features"
      >
        <span>Sign in with Puter</span>
      </button>
    )
  }

  return (
    <nav className="bg-github-bg-secondary border-b border-github-border px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-github-text" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h1 className="text-xl font-semibold text-github-text">{APP_CONFIG.name}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {renderAuthSection()}
        </div>
      </div>
    </nav>
  )
}

export default Navbar