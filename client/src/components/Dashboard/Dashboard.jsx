import React from 'react'
import { Grid, Button } from '@mui/material';
import TransactionChart from './TransactionChart'
import SavingsCard from './TotalSavingsCard'
import Navbar from '../Navbar'
import PlaidButton from '../Plaid/PlaidButton'
import { AppContext } from "../../context/Context"

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
        
        <>
        {/* <Navbar /> */}
        <h1 style={{ color: '#009933', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Welcome {user?.displayName}</h1>
        <Grid container spacing={2}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <SavingsCard />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <SavingsCard />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <SavingsCard />
            </Grid>
            <Grid container spacing={1} py={2}>
                <Grid item xs={12} md={8}>
                </Grid>
            </Grid>
        </Grid>
        <PlaidButton />
        <Button variant="contained" color="primary" onClick={handleSignOut}>Sign Out</Button>
        <TransactionChart />
        </>
    )
}

export default Dashboard