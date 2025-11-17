import { useState, useEffect } from 'react'
import { API_CONFIG } from '../../../constants/app.js'

const TypewriterEffect = ({ texts, onComplete, onDemoClick }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // Faster cursor blink for CLI feel
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, API_CONFIG.animationDelays.cursor)

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
        }, API_CONFIG.typingSpeed.min + Math.random() * (API_CONFIG.typingSpeed.max - API_CONFIG.typingSpeed.min))

        return () => clearTimeout(timeout)
      } else {
        // Finished typing current text
        if (currentTextIndex < texts.length - 1) {
          // Move to next text after a shorter pause
          const timeout = setTimeout(() => {
            setCurrentTextIndex(prev => prev + 1)
            setCurrentCharIndex(0)
            setCurrentText('')
          }, API_CONFIG.animationDelays.typewriter)
          
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
        {/* Show all completed texts */}
        {!isTyping && texts.map((text, index) => (
          <div key={index} className="text-github-text-secondary leading-relaxed">
            {text || '\u00A0'}
          </div>
        ))}

        {/* Show typing in progress */}
        {isTyping && (
          <>
            {texts.slice(0, currentTextIndex).map((text, index) => (
              <div key={index} className="text-github-text-secondary leading-relaxed">
                {text || '\u00A0'}
              </div>
            ))}

            <div className="text-github-text-secondary leading-relaxed">
              {currentText}
              {showCursor && (
                <span className="text-github-accent bg-github-accent text-github-bg ml-1 px-1">
                  _
                </span>
              )}
            </div>
          </>
        )}

        {/* Show demo button when typing is complete */}
        {!isTyping && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onDemoClick}
              className="bg-github-accent hover:bg-github-accent-hover text-white font-medium py-3 px-6 rounded-md
                       transition duration-200 border border-github-accent hover:border-github-accent-hover
                       flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Try Demo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TypewriterEffect