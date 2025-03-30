import './App.css'
import Header from './components/Header'

function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <div className="container">
          <h1>Welcome to Feudle</h1>
          <p>A game show themed word puzzle game</p>
        </div>
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
