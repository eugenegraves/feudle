import './App.css'
import Header from './components/Header'
import Landing from './components/Landing'

function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Landing />
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
