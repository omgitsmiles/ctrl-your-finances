import React from 'react'
import { Grid, Button, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import TransactionChart from './TransactionChart'
import SavingsCard from './TotalSavingsCard'
import PlaidButton from '../Plaid/PlaidButton'
import { AppContext } from "../../context/Context"
import Budgeting from '../Budgeting';

function Dashboard() {
    const { logOut, user, transactions } = AppContext();

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error);
        }
    }

    const theme = createTheme();

    theme.typography.h4 = {
    fontSize: '1.4rem',
    '@media (min-width:360px)': {
        fontSize: '1.6rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.9rem',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '3.7rem',
    },
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Typography 
                variant="h4"
                style={{ 
                    color: '#009933',
                    textAlign: 'center',
                    fontFamily: 'Playfair Display, serif',
                    margin: '1rem',
                    
                    }}>
                    Welcome, {user?.displayName}
                </Typography>
            </ThemeProvider>
            <PlaidButton />
            <TransactionChart />
            <Budgeting />
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

            <Button fullWidth variant="contained" color="primary" onClick={handleSignOut}>Sign Out</Button>

        </>
    )
}

export default Dashboard