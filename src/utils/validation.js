import { VALIDATION_RULES, API_CONFIG } from '../constants/app.js'

/**
 * Validates git diff input format
 * @param {string} input - The git diff input to validate
 * @returns {Object} Validation result with success/error/warning
 */
export const validateGitDiff = (input) => {
  const trimmed = input.trim()
  
  // Check for empty input
  if (!trimmed) {
    return { 
      valid: false, 
      error: 'Please paste your git diff output first' 
    }
  }
  
  const { gitDiff } = VALIDATION_RULES
  
  // Check for basic git diff markers
  const hasGitDiffHeader = /^diff --git/.test(trimmed) || trimmed.includes('diff --git')
  const hasFileMarkers = trimmed.includes('---') && trimmed.includes('+++')
  const hasHunkHeaders = gitDiff.hunkPattern.test(trimmed)
  const hasChanges = gitDiff.changeMarkers.some(marker => trimmed.includes(marker))
  
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

/**
 * Sanitizes user input to prevent XSS and limit size
 * @param {string} input - The input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, API_CONFIG.maxInputSize) // Limit input size
}

/**
 * Validates commit message format
 * @param {string} message - Commit message to validate
 * @returns {Object} Validation result
 */
export const validateCommitMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' }
  }
  
  const trimmed = message.trim()
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' }
  }
  
  if (trimmed.length > 72) {
    return { 
      valid: false, 
      error: `Message too long (${trimmed.length}/72 characters)` 
    }
  }
  
  // Basic conventional commit format check
  const conventionalPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/
  if (!conventionalPattern.test(trimmed)) {
    return {
      valid: true,
      warning: 'Message doesn\'t follow conventional commit format'
    }
  }
  
  return { valid: true }
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Copies text to clipboard with error handling
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    
    // Fallback method
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}