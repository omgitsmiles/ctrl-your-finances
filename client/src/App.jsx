import { Outlet } from 'react-router-dom'
import { ContextProvider } from './context/Context'
import './App.css'
import ResponsiveAppBar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  return (
    <div>
      <ContextProvider>
        <ResponsiveAppBar />
        <Outlet />
        <Footer />
      </ContextProvider>
    </div>
  )
}

export default App
