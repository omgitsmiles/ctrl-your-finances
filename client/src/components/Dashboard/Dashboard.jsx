import React from 'react'
import { Grid } from '@mui/material';
import TransactionChart from './TransactionChart'
import SavingsCard from './TotalSavingsCard'
import Navbar from '../Navbar'


function Dashboard() {

    return (
        <>
        <Navbar />
        <h1 style={{ color: '#009933', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Welcome User</h1>
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
        <TransactionChart />
        </>
    )
}

export default Dashboard