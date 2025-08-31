import { useState, useEffect } from 'react'

const TypewriterEffect = ({ texts, onComplete }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // Faster cursor blink for CLI feel
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 400)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (!texts || texts.length === 0) return

    const currentFullText = texts[currentTextIndex]
    
    if (isTyping) {
      if (currentCharIndex < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentCharIndex + 1))
          setCurrentCharIndex(prev => prev + 1)
        }, 15 + Math.random() * 10) // Fast CLI-style typing

        return () => clearTimeout(timeout)
      } else {
        // Finished typing current text
        if (currentTextIndex < texts.length - 1) {
          // Move to next text after a shorter pause
          const timeout = setTimeout(() => {
            setCurrentTextIndex(prev => prev + 1)
            setCurrentCharIndex(0)
            setCurrentText('')
          }, 300)
          
          return () => clearTimeout(timeout)
        } else {
          // Finished all texts
          setIsTyping(false)
          if (onComplete) {
            onComplete()
          }
        }
      }
    }
  }, [currentCharIndex, currentTextIndex, texts, isTyping, onComplete])

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-2 font-mono text-sm">
        {texts.slice(0, currentTextIndex).map((text, index) => (
          <div key={index} className="text-github-text-secondary leading-relaxed">
            {text}
          </div>
        ))}
        
        {currentText && (
          <div className="text-github-text-secondary leading-relaxed">
            {currentText}
            {showCursor && (
              <span className="text-github-accent bg-github-accent text-github-bg ml-1 px-1">
                _
              </span>
            )}
          </div>
        )}
        
        {!isTyping && (
          <div className="mt-8 p-4 bg-github-bg-tertiary border border-github-border rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-github-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-github-text">Ready to generate commit messages</span>
            </div>
            <p className="text-xs text-github-text-secondary">
              Paste your git diff in the left panel and click Generate
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TypewriterEffect