import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// mui imports
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Stack } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppContext } from '../../context/Context';
import { styled } from '@mui/system';

const Login = () => {
    const { googleSignIn, user, signInWithEmail } = AppContext();
    const navigate = useNavigate();

    const [openEmailLogIn, setOpenEmailLogIn] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }
    const handleEmailClickOpen = () => {
        setOpenEmailLogIn(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await signInWithEmail(email, password, (error) => {
                if (error) {
                    let errorMessage = error.message;
                    if (errorMessage.includes('(auth/invalid-credential)')) {
                        errorMessage = "Incorrect email or password. Please try again.";
                    }
                    setError(errorMessage);
                    console.log("Sign in error:", errorMessage)
                } else {
                    navigate('/dashboard');
                }  
            })
        } catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => {
        if (user != null) {
            navigate('/dashboard')
        }
    }, [user])

    const labelStyle = {
        color: 'green',
        fontSize: '1.2rem',
        textAlign: 'center',
        paddingBottom: '.3rem'
    }

    const inputStyle = {
        border: '1.5px solid green',
        borderRadius: '5px',
        padding: '.3rem',
        width: '100%',
        maxWidth: '150px',
        minWidth: '150px',
        backgroundColor: '#bce5af',
        color: 'green',
        fontFamily: 'Poppins',
        fontSize: '.75rem',
    }

    const ColorButton = styled(Button)(() => ({
        color: 'green',
        backgroundColor: 'white',
        fontFamily: 'Poppins',
        maxWidth: '250px', 
        maxHeight: '40px', 
        minWidth: '250px', 
        minHeight: '40px',
        border: '1px solid green',
        '&:hover': {
            backgroundColor: 'green',
            color: 'white',
        },
        }));

    return (
        <main
            style={{
                    margin: '1rem auto',
                    marginBottom: '2rem',
                }}
        >
            {!openEmailLogIn ? (
            <Stack 
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ minWidth: 12 }}
            >
                <h2
                    style={
                    {color: 'green',
                    textAlign: 'center',
                    fontSize: '3rem',
                    margin: '.75rem 0',
                    marginBottom: '.2rem'
                    }
                }
                >Welcome Back</h2>
                <ColorButton 
                    startIcon={<AccountCircleIcon />}
                    onClick={handleEmailClickOpen}
                >
                        Sign in with email
                </ColorButton>
                <ColorButton  
                    startIcon={<GoogleIcon/>}
                    onClick={handleGoogleSignIn}
                >
                Continue with Google
                </ColorButton>
                <p style={{color: 'green'}}>
                    Don't have an account yet?{' '}
                    <Link
                        component="button"
                        style={{
                            color: '#637099',
                        }}
                        to="/signup" 
                    >
                    Sign up
                    </Link>
                </p> 
            </Stack>
            ) : (
            <section>
                <Button 
                    onClick={() => {setOpenEmailLogIn(false)}}
                    style={{
                        backgroundColor: 'white',
                        color: 'green',
                        marginTop: '1rem',
                        marginLeft: '1rem',
                        border: 'none'
                    }}
                >
                    { <ArrowBackIcon fontSize='large' /> }
                </Button>
                <div
                    style={{
                        display: 'flex', 
                        flexDirection: 'column', alignItems: 'center',
                        margin: '1rem auto',
                        padding: '1rem',
                        border: '2px solid green',
                        borderRadius: '10px',
                        width: '400px',
                        backgroundColor: '#A0DB8E'
                    }}
                >        
                    <h2
                        style={{
                            color: 'green',
                            textAlign: 'center',
                            fontSize: '2.7rem',
                            margin: '.5rem 0',
                            marginBottom: '0rem'
                        }}
                    >Sign in</h2>    
                    <form 
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                        }}
                        onSubmit={handleSubmit}
                    > 
                        <div
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                paddingTop: '.5rem'
                            }}
                        >
                            <label      
                                htmlFor="email-address"
                                style={labelStyle}
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required
                                placeholder="Email address" 
                                style={inputStyle}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                paddingTop: '.5rem'
                            }}
                        >
                            <label 
                                htmlFor="password"
                                style={labelStyle}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Password"
                                style={inputStyle}
                            />
                        </div>      
                        <Button
                            style={{
                                margin: '1rem auto',
                                display: 'flex',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                            variant='contained'
                            size='medium'
                        >  
                            Sign in
                        </Button>
                    </form>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <p style={{
                        color: 'green',
                        fontSize: '.9rem',
                        marginTop: '.5rem'
                    }}>
                        Don't have an account yet?{' '}
                        <Link
                        component="button"
                        style={{
                            color: '#637099'
                        }}
                        to="/signup" 
                        >
                        Sign up
                        </Link>
                    </p>                   
                </div>
            </section>) 
            }
        </main>
    )
}

export default Login