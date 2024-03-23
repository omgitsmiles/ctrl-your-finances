import React from 'react'
import { Button,  Modal, Stack, Box, styled, Typography } from '@mui/material';
import moneyMagnet from '../../assets/Layer_1.png';

const Header = () => {

    const CustomBox = styled(Box) (({ theme }) => ({
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'space-between',
        gap: theme.spacing(2),
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
        backgroundColor: '#009933',
        color: '#fff',
        width: '100%',
        margin: 0,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }
    }))

    const BoxText = styled(Box) (({ theme }) => ({
        // flex: '1',
        paddingLeft: theme.spacing(8),
        [theme.breakpoints.down('md')]: {
            flex: '2',
            textAlign: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }));

    return (
        <>
    <CustomBox component='header'>
            <img
                src={moneyMagnet}
                alt="headerImg"
                style={{ 
                    width: "40%", 
                    marginBottom: 0,
                    
                }}
                />
            <BoxText 
            component='section'
            >
                <Typography
                variant='h2'
                component= 'h1'
                sx={{
                    font: 'Staaliches-Regular',
                    fontWeight: 700,
                    color: '#fff',
                    paddingTop: 10,
                }}
                >
                    Welcome to Money Magnet!
                </Typography>

                <Typography
                variant='p'
                component='p'
                sx={{
                    py: 1,
                    lineHeight: 1.6,
                    color: '#fff',
                    fontWeight: 'bold',
                }}
                >
                    Together, we’re going to make some amazing things!
                </Typography>
                <Box sx={{ py: 2 }}>
                    {/* <Button 
                    variant='contained'
                    sx={{
                        mr: 2,
                        px: 4, 
                        py: 1,
                        fontSize: '0.9rem',
                        textTransform: 'capitalize',
                        borderRadius: 0,
                        borderColor: '#14192d',
                        color: '#fff',
                        backgroundColor: '#14192d',
                        "&&:hover": {
                            backgroundColor: "#343a55"
                        },
                        "&&:focus": {
                            backgroundColor: "#343a55"
                        }
                    }}
                    >
                        Sign Up
                    </Button>
                    <Button 
                    // component={} 
                    // to={'/about'}
                    variant='outlined'
                    sx={{
                        px: 4, 
                        py: 1,
                        fontSize:'0.9rem',
                        textTransform: 'capitalize',
                        borderRadius: 0,
                        color: '#fff',
                        backgroundColor: 'transparent',
                        borderColor: '#fff',
                        "&&:hover": {
                            color: '#343a55',
                            borderColor: '#343a55',
                        },
                        "&&:focus": {
                            color: '#343a55',
                            borderColor: '#343a55',
                        }
                    }}
                    >
                        Log In
                    </Button> */}
                </Box>
                <Typography
                variant='p'
                component='p'
                sx={{
                    py: 3,
                    lineHeight: 1.6,
                    color: '#fff',
                }}
                >
                    At Money Magnet, we firmly believe that exceptional financial planning and budgeting go beyond numbers; it's a reflection of purpose, strategy, and the ability to leave a lasting impact on your financial future. Our brand guidelines serve as your compass as we navigate through our creative philosophy, principles, and visual identity.
                </Typography>
            </BoxText>
        </CustomBox>
        </>
  )
}

export default Header