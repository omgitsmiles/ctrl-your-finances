import React from 'react'
import { Grid, Button, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleAI from './GoogleAI';
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Typography 
                    variant="h4"
                    style={{ 
                        color: '#009933',
                        textAlign: 'center',
                        fontFamily: 'Playfair Display, serif',
                        marginTop: '1rem',
                        marginBottom: '0rem',
                        fontSize: '2.9rem'
                        }}>
                        Welcome Back, 
                    </Typography>
                    <Typography
                        variant="h4"
                        style={{
                            color: '#009933',
                        textAlign: 'center',
                        fontFamily: 'Playfair Display, serif',
                        marginTop: '0rem',
                        padding: '0rem',
                        marginBottom: '1rem',
                        fontSize: '2.9rem'
                        }
                        }
                        
                    >   
                        {user?.displayName}
                    </Typography>
                </Box>
            </ThemeProvider>
            
                <PlaidButton />
                <GoogleAI />
            
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
        </>
    )
}

export default Dashboard