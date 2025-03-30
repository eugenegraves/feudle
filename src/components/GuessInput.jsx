import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

function GuessInput({ isSubmitting }) {
  const [guesses, setGuesses] = useState(['', '', ''])
  const inputsRef = useRef([])
  
  // Register input refs
  const registerInputRef = (el, index) => {
    inputsRef.current[index] = el
  }
  
  // Handle input changes
  const handleInputChange = (index, value) => {
    const newGuesses = [...guesses]
    newGuesses[index] = value
    setGuesses(newGuesses)
    
    // Removed the auto-focus to next input behavior
  }
  
  // Handle key presses for navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      // Move to next input or submit
      if (index < 2) {
        inputsRef.current[index + 1].focus()
      }
    } else if (e.key === 'Backspace' && !guesses[index]) {
      // Move to previous input when backspacing an empty field
      if (index > 0) {
        inputsRef.current[index - 1].focus()
      }
    }
  }
  
  // Animate inputs on mount
  useEffect(() => {
    gsap.fromTo('.guess-input-field',
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.2,
        ease: "back.out(1.7)"
      }
    )
  }, [])
  
  // Handle disabled state during submission
  useEffect(() => {
    if (isSubmitting) {
      // Shake effect on submit
      gsap.to('.guess-input-field', {
        x: 5,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut"
      })
    }
  }, [isSubmitting])
  
  return (
    <div className="guess-input-container">
      <h3>Enter your guesses:</h3>
      <div className="input-group">
        {guesses.map((guess, index) => (
          <div key={index} className="input-wrapper">
            <input
              type="text"
              value={guess}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => registerInputRef(el, index)}
              className="guess-input-field"
              disabled={isSubmitting}
              maxLength={20}
              placeholder={`Guess ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuessInput 