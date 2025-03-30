import { useState, useEffect } from 'react'

function Header({ gameState = 'home', onNavigate }) {
  const [activeNav, setActiveNav] = useState(gameState)
  
  // Update active navigation when gameState changes
  useEffect(() => {
    setActiveNav(gameState)
  }, [gameState])
  
  const handleNavClick = (navState) => {
    // Only allow navigation to accessible states
    if (canNavigateTo(navState)) {
      setActiveNav(navState)
      
      if (onNavigate) {
        onNavigate(navState)
      }
    }
  }
  
  // Define which states are navigable based on current game state
  const canNavigateTo = (targetState) => {
    // Home is always accessible
    if (targetState === 'home') return true
    
    // Play is accessible only from home
    if (targetState === 'play' && gameState === 'home') return true
    
    // Results is accessible only after playing
    if (targetState === 'results' && gameState === 'results') return true
    
    // Leaderboard is always accessible
    if (targetState === 'leaderboard') return true
    
    return false
  }
  
  // Visual indication for disabled states
  const getNavItemClass = (navState) => {
    let classes = activeNav === navState ? 'active' : ''
    if (!canNavigateTo(navState) && navState !== activeNav) {
      classes += ' disabled'
    }
    return classes
  }

  return (
    <div className="sticky-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>Feudle</h2>
          </div>
          <nav className="main-nav">
            <ul>
              <li className={getNavItemClass('home')}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('home')
                  }}
                >
                  Home
                </a>
              </li>
              <li className={getNavItemClass('play')}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('play')
                  }}
                >
                  Play
                </a>
              </li>
              <li className={getNavItemClass('results')}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('results')
                  }}
                >
                  Results
                </a>
              </li>
              <li className={getNavItemClass('leaderboard')}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('leaderboard')
                  }}
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header 