import { useOutletContext } from "react-router"
import Button from '@mui/material/Button'
import React, { useContext, useEffect } from 'react'

import TransactionChart from './TransactionChart'
import PlaidButton from "./Plaid/PlaidButton"
import { AppContext } from "../context/Context"


function Dashboard() {
    const { logOut, user, transactions } = AppContext();

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main>
            <div>
                <h2>Welcome, {user?.displayName}</h2>
            </div>
            <PlaidButton />
            <TransactionChart transactionData={transactions} />
            <Button variant="contained" color="primary" onClick={handleSignOut}>Sign Out</Button>
        </main>
    )
}

export default Dashboard