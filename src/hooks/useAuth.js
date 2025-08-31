import { useState, useEffect } from 'react'
import { puterService } from '../services/puterService.js'
import { API_CONFIG } from '../constants/app.js'

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const checkAuthStatus = async () => {
      try {
        setError(null)
        
        // Small delay to ensure Puter SDK is loaded
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.animationDelays.authCheck)
        )
        
        const isSignedIn = await puterService.checkAuthStatus()
        
        if (isMounted) {
          setIsAuthenticated(isSignedIn)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        
        if (isMounted) {
          setError(err.message)
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      }
    }

    checkAuthStatus()

    // Set up auth change listener
    const unsubscribe = puterService.onAuthChange((authStatus) => {
      if (isMounted) {
        setIsAuthenticated(authStatus)
        setError(null)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const signIn = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const success = await puterService.signIn()
      
      if (success) {
        setIsAuthenticated(true)
      } else {
        setError('Sign in was cancelled or failed')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const success = await puterService.signOut()
      
      if (success) {
        setIsAuthenticated(false)
      } else {
        setError('Sign out failed')
      }
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
  }
}