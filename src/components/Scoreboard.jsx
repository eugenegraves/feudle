import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Scoreboard({ score, strikes }) {
  const scoreRef = useRef(null)
  
  // Animate score changes
  useEffect(() => {
    if (scoreRef.current) {
      gsap.from(scoreRef.current, {
        textContent: parseInt(scoreRef.current.textContent),
        duration: 1,
        ease: "power1.out",
        snap: { textContent: 1 },
        stagger: {
          each: 0.1,
          onUpdate: function() {
            this.targets()[0].innerHTML = Math.ceil(this.targets()[0].textContent);
          },
        }
      })
    }
  }, [score])
  
  // Render X's for strikes
  const renderStrikes = () => {
    const maxStrikes = 3
    const strikesDisplay = []
    
    for (let i = 0; i < maxStrikes; i++) {
      strikesDisplay.push(
        <span 
          key={i} 
          className={`strike-indicator ${i < strikes ? 'active' : ''}`}
        >
          X
        </span>
      )
    }
    
    return strikesDisplay
  }
  
  return (
    <div className="scoreboard">
      <div className="score-container">
        <h3>Points</h3>
        <span className="score-value" ref={scoreRef}>{score}</span>
        <span className="score-max">/100</span>
      </div>
      
      <div className="strikes-container">
        <h3>Strikes</h3>
        <div className="strikes-value">
          {renderStrikes()}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard 