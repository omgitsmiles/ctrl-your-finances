import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button,  Modal, Stack, Box, Typography } from '@mui/material';
import moneyMagnet from '../../assets/Layer_1.png';
import { styled } from '@mui/system';
import { AppContext } from '../../context/Context';

const Header = () => {
    const navigate = useNavigate();
    const { user } = AppContext();

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

    const ColorButton = styled(Button)(() => ({
        color: 'green',
        backgroundColor: 'white',
        fontFamily: 'Poppins',
        maxWidth: '200px', 
        maxHeight: '50px', 
        minWidth: '200px', 
        minHeight: '50px',
        border: '1px solid green',
        fontSize: '1.4rem',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: 'green',
            color: 'white',
        },
        paddingLeft: '1rem',
        paddingRight: '1rem',
        maxWidth: {xs: '180px'},
        maxHeight: {xs: '30px'},
        minWidth: {xs: '180px'},
        minHeight: {xs: '30px'},
        }));


    return (
        <>
    <CustomBox 
    component='header'
    sx={{
        padding: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
    }
    >
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
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                padding: 3,
                marginRight: 2,
            }}
            >
                <Typography
                variant='h2'
                component= 'h1'
                sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 500,
                    color: '#fff',
                    paddingTop: 0,
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontSize: '3rem',
                }}
                >
                    Welcome to Money Magnet!
                </Typography>

                <Typography
                variant='p'
                component='p'
                sx={{
                    py: 0,
                    lineHeight: 1.6,
                    color: '#fff',
                    fontWeight: 500,
                    letterSpacing: 2,
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: {'xs': '1.2rem'}
                }}
                >
                    Empowering Financial Futures: Where AI Drives Strategic Wealth Creation
                </Typography>


                <Typography
                variant='p'
                component='p'
                sx={{
                    py: 2,
                    lineHeight: 1.6,
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: {'xs': '1rem'},
                    letterSpacing: .5,
                }}
                >
                    At Money Magnet, we firmly believe that exceptional financial planning and budgeting go beyond numbers; it's a reflection of purpose, strategy, and the ability to leave a lasting impact on your financial future. Our brand guidelines serve as your compass as we navigate through our creative philosophy, principles, and visual identity.
                </Typography>
                <Box sx={{ 
                    py: 2, 
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    
                    alignItems: 'center',
                    }}>
                    {!user ? (
                        <Stack sx={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 3,
                                alignItems: 'center',
                                width: '100%',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                flex: 1,
                                padding: 0
                            }
                        
                        }>
                            <ColorButton 
                                onClick={() => navigate('/signup')}
                            
                            >
                                Sign Up
                            </ColorButton>
                            <ColorButton  
                                onClick={() => navigate('/login')}
                            
                            >
                                Log In
                            </ColorButton>
                        </Stack>
                    ) : (
                        <ColorButton onClick={() => navigate('/dashboard')}>Dashboard</ColorButton>
                    )}
                </Box>
            </BoxText>
        </CustomBox>
        </>
    )
}

export default Header