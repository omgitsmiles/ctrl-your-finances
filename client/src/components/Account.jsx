import React from 'react'
import Button from '@mui/material/Button'
import { UserAuth } from '../context/AuthContext'


function Account() {
    const { logOut, user } = UserAuth()

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error);
        }
    }

    console.log(user)

    return (
        <div>
            <h1>Account Management</h1>
            <div>
                <h2>Welcome, {user?.displayName}</h2>
            </div>
            <Button variant="contained" color="primary" onClick={handleSignOut}>Sign Out</Button>
        </div>
    )
}

export default Account