import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext';
import './App.css'
import NavBar from './components/NavBar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <AuthContextProvider>
        <NavBar></NavBar>
        <Outlet />
      </AuthContextProvider>
    </div>
  )
}

export default App
