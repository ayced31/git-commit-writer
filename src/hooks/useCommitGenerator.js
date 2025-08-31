import { useState } from 'react'
import { puterService } from '../services/puterService.js'
import { validateGitDiff, sanitizeInput } from '../utils/validation.js'
import { UI_CONSTANTS } from '../constants/app.js'

/**
 * Custom hook for managing commit message generation
 * @returns {Object} Generation state and methods
 */
export const useCommitGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [commitMessages, setCommitMessages] = useState([])
  const [error, setError] = useState('')

  const generateCommitMessages = async (diffInput, isAuthenticated) => {
    // Clear previous state
    setError('')
    setCommitMessages([])

    // Check authentication
    if (!isAuthenticated) {
      setError('Please sign in with Puter to use AI features')
      return
    }

    // Validate input
    const validation = validateGitDiff(diffInput)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setIsGenerating(true)

    try {
      // Sanitize input
      const sanitizedInput = sanitizeInput(diffInput)

      // Generate commit messages
      const messages = await puterService.generateCommitMessages(
        sanitizedInput, 
        { 
          maxMessages: UI_CONSTANTS.maxCommitMessages,
          warning: validation.warning 
        }
      )

      setCommitMessages(messages)
      
      // Show warning if present
      if (validation.warning) {
        console.warn('Git diff validation warning:', validation.warning)
      }

    } catch (err) {
      console.error('Generation failed:', err)
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const clearResults = () => {
    setCommitMessages([])
    setError('')
  }

  const clearError = () => {
    setError('')
  }

  return {
    isGenerating,
    commitMessages,
    error,
    generateCommitMessages,
    clearResults,
    clearError,
    hasResults: commitMessages.length > 0,
  }
}