import { Outlet, useLocation } from 'react-router-dom'
import { ContextProvider } from './context/Context'
import './App.css'
import ResponsiveAppBar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const location = useLocation();

  

  // location.pathname === `/projects/${params.id}/edit`

  return (
    <div>
      <ContextProvider>
        {(location.pathname !== '/') && <ResponsiveAppBar />}
        <Outlet />
        <Footer />
      </ContextProvider>
    </div>
  )
}

export default App
