import { useState, useEffect } from 'react'
import gsap from 'gsap'
import './rules.css'

function RulesOverlay({ onClose }) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    // Animate the overlay in
    gsap.fromTo('.rules-overlay',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    
    // Animate the content in
    gsap.fromTo('.rules-content',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.7)" }
    )
  }, [])
  
  const handleClose = () => {
    // Animate out before unmounting
    gsap.to('.rules-overlay', {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setVisible(false)
        if (onClose) onClose()
      }
    })
  }
  
  if (!visible) return null
  
  return (
    <div className="rules-overlay">
      <div className="rules-content">
        <div className="rules-header">
          <h2>How to Play Feudle</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="rules-body">
          <section>
            <h3>Game Objective</h3>
            <p>Guess the most popular answers to the given prompt, just like in a family feud game show!</p>
          </section>
          
          <section>
            <h3>How to Play</h3>
            <ol>
              <li><strong>Read the prompt</strong> at the top of the screen.</li>
              <li><strong>Enter up to three guesses</strong> in the input fields below the prompt. Each guess should be a complete word or phrase.</li>
              <li><strong>Press "Submit Guess"</strong> when you're ready to check your answers.</li>
              <li><strong>Score points</strong> for correct answers. The more popular your answer, the more points you'll earn.</li>
              <li><strong>Avoid strikes</strong> - you'll get a strike for incorrect answers. Three strikes and you're out!</li>
              <li><strong>Try to reach 100 points</strong> before getting three strikes.</li>
            </ol>
          </section>
          
          <section>
            <h3>Controls</h3>
            <ul>
              <li>Press <strong>Enter</strong> to move to the next input field</li>
              <li>Press <strong>Backspace</strong> on an empty field to go back to the previous field</li>
              <li>Click the <strong>Submit Guess</strong> button to check your answers</li>
            </ul>
          </section>
        </div>
        
        <div className="rules-footer">
          <button className="play-button" onClick={handleClose}>Start Playing</button>
        </div>
      </div>
    </div>
  )
}

export default RulesOverlay 