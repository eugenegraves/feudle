import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function ResultsBoard({ score, maxScore, strikes, maxStrikes }) {
  const scoreValueRef = useRef(null)
  const strikesValueRef = useRef(null)
  const isWinner = score >= 50
  
  // Animate score and strikes counters
  useEffect(() => {
    // Animate score counter rolling up
    gsap.fromTo(scoreValueRef.current, 
      { innerText: 0 }, 
      { 
        innerText: score,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function() {
          scoreValueRef.current.innerText = Math.ceil(this.targets()[0].innerText)
        }
      }
    )
    
    // Animate strikes counter
    gsap.fromTo(strikesValueRef.current, 
      { innerText: 0 }, 
      { 
        innerText: strikes,
        duration: 1.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function() {
          strikesValueRef.current.innerText = Math.ceil(this.targets()[0].innerText)
        }
      }
    )
    
    // Animate result messages
    if (isWinner) {
      gsap.fromTo('.winner-message',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 2.5,
          ease: "power3.out"
        }
      )
      
      // Add flashing effect to winner message
      gsap.to('.winner-message', {
        color: '#ffd700',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
        delay: 3,
        duration: 0.5,
        repeat: -1,
        yoyo: true
      })
    } else {
      gsap.fromTo('.loser-message',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 2.5,
          ease: "power3.out"
        }
      )
      
      // Add flashing effect to loser message
      gsap.to('.loser-message', {
        color: '#ff0000',
        textShadow: '0 0 10px rgba(255, 0, 0, 0.7)',
        delay: 3,
        duration: 0.5,
        repeat: -1,
        yoyo: true
      })
    }
  }, [score, strikes, isWinner])
  
  return (
    <div className="results-board">
      <div className="results-row">
        <div className="results-item">
          <h3>Final Score</h3>
          <div className="results-value">
            <span ref={scoreValueRef} className="results-number">0</span>
            <span className="results-max">/{maxScore}</span>
          </div>
        </div>
        
        <div className="results-item">
          <h3>Strikes</h3>
          <div className="results-value">
            <span ref={strikesValueRef} className="results-number">0</span>
            <span className="results-max">/{maxStrikes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsBoard 