import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext';
import './App.css'
import NavBar from './components/NavBar';

function App() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [houseMembers, setHouseMembers] = useState([]);
  const [household, setHousehold] = useState([]);
  const [error, setError] = useState('');

  //// CHANGE THIS WHEN USER SESSION COOKIES ESTABLISHED /////
  const userID = 1

  useEffect(() => {
    // retrieve user accounts info
    fetch(`http://127.0.0.1:5555/api/accounts/${userID}`)
    .then(resp => {
      if (resp.ok) {
        resp.json()
        .then(accounts => setBankAccounts(accounts))
      }
      else {
        resp.json()
        .then(message => setError(message.error))
      }
    })

    // retrieve household member info
    fetch(`http://127.0.0.1:5555/api/household/${userID}`)
    .then(resp => {
      if (resp.ok) {
        resp.json()
        .then(houseData => {
          setHouseMembers(houseData['members'])
          setHousehold(houseData['household'])
        })
      }
      else {
        resp.json()
        .then(message => setError(message.error))
      }
    })
  }, [])

  const context = {
    bankAccounts,
    setBankAccounts,
    houseMembers,
    household,
    error,
    setError,
  }

  return (
    <div>
      <AuthContextProvider>
        <NavBar></NavBar>
        <Outlet context={context}/>
      </AuthContextProvider>
    </div>
  )
}

export default App
