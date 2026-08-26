
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import './App.css'

function App() {
  return (
    <div className="comp site-layout">
      <header className="site-header"><Header /></header>
      <main className="site-content"><Main /></main>
      <footer className="site-footer"><Footer /></footer>
    </div>
  )
}

export default App
