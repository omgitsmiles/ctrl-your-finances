import { UserAuth } from "../context/AuthContext" 
import Button from '@mui/material/Button'
import React, { useEffect } from 'react'
import TransactionChart from './TransactionChart'


function Dashboard() {
    const { logOut, user } = UserAuth()

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error);
        }
    }

    console.log('user: ' ,user)

    return (
        <main>
            <div>
                <h2>Welcome, {user?.displayName}</h2>
            </div>
            {/* <TransactionChart /> */}
            <Button variant="contained" color="primary" onClick={handleSignOut}>Sign Out</Button>
        </main>
    )
}

export default Dashboard