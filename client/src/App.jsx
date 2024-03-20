import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [household, setHousehold] = useState([]);

  useEffect(() => {
    // retrieve user account info
    // retrieve household member info
  }, [])

  context = {
    bankAccounts,
    household,
  }

  return (
    <>
      <Outlet context={context} />
    </>
  )
}

export default App
