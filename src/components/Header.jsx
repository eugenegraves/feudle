import { useState } from 'react'

function Header() {
  const [activeNav, setActiveNav] = useState('home')

  return (
    <div className="sticky-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>Feudle</h2>
          </div>
          <nav className="main-nav">
            <ul>
              <li className={activeNav === 'home' ? 'active' : ''}>
                <a href="#" onClick={() => setActiveNav('home')}>Home</a>
              </li>
              <li className={activeNav === 'play' ? 'active' : ''}>
                <a href="#" onClick={() => setActiveNav('play')}>Play</a>
              </li>
              <li className={activeNav === 'results' ? 'active' : ''}>
                <a href="#" onClick={() => setActiveNav('results')}>Results</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header 