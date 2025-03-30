import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Landing from './components/Landing'
import Game from './components/Game'
import Results from './components/Results'
import Leaderboard from './components/Leaderboard'

function App() {
  const [gameState, setGameState] = useState('home')
  const [gameData, setGameData] = useState({
    score: 0,
    strikes: 0
  })
  
  const handleNavigate = (newState) => {
    setGameState(newState)
  }
  
  // Handler for game-specific navigation buttons
  const handleGameAction = (action, data) => {
    switch (action) {
      case 'start-game':
        setGameState('play')
        // Reset game data when starting a new game
        setGameData({
          score: 0,
          strikes: 0
        })
        break
      case 'show-results':
        // Save game data when showing results
        if (data) {
          setGameData(data)
        }
        setGameState('results')
        break
      case 'play-again':
        setGameState('play')
        // Reset game data when playing again
        setGameData({
          score: 0,
          strikes: 0
        })
        break
      case 'go-home':
        setGameState('home')
        break
      case 'show-leaderboard':
        setGameState('leaderboard')
        break
      default:
        break
    }
  }
  
  // Render the appropriate component based on game state
  const renderGameContent = () => {
    switch (gameState) {
      case 'home':
        return <Landing onPlay={() => handleGameAction('start-game')} />
      case 'play':
        return <Game 
          onGameOver={(data) => handleGameAction('show-results', data)} 
        />
      case 'results':
        return <Results 
          score={gameData.score}
          strikes={gameData.strikes}
          onPlayAgain={() => handleGameAction('play-again')} 
        />
      case 'leaderboard':
        return <Leaderboard />
      default:
        return <Landing onPlay={() => handleGameAction('start-game')} />
    }
  }
  
  return (
    <>
      <header>
        <Header gameState={gameState} onNavigate={handleNavigate} />
      </header>
      <main>
        {renderGameContent()}
      </main>
      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Feudle Game</p>
        </div>
      </footer>
    </>
  )
}

export default App
