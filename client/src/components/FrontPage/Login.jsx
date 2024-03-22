import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// mui imports
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Stack } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Login = () => {
    const { googleSignIn, user, signInWithEmail } = UserAuth();
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

    return (
        <main>
            {!openEmailLogIn ? (
            <Stack 
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ minWidth: 12 }}
            >
                <h2>Welcome Back</h2>
                <Button 
                    style={{maxWidth: '250px', maxHeight: '40px', minWidth: '250px', minHeight: '40px'}}
                    size="large" 
                    variant='outlined' 
                    startIcon={<AccountCircleIcon />}
                    onClick={handleEmailClickOpen}
                >
                        Sign in with email
                </Button>
                <Button 
                style={{
                    maxWidth: '250px', maxHeight: '60px', 
                    minWidth: '250px', 
                    minHeight: '40px'
                }}
                size="medium" variant='outlined' 
                startIcon={<GoogleIcon/>}
                onClick={handleGoogleSignIn}
                >
                Continue with Google
                </Button>
                <p>
                    Don't have an account yet?{' '}
                    <Link
                    component="button"
                    variant="body2"
                    to="/signup" 
                    >
                    Sign up
                    </Link>
                </p> 
            </Stack>
            ) : (
            <section>
                <Button onClick={() => {setOpenEmailLogIn(false)}}>
                    {'<- Back'}
                </Button>
                <div>            
                    <form onSubmit={handleSubmit}> 
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required
                                placeholder="Email address" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Password"
                            />
                        </div>      
                        <button type="submit">  
                            Sign up
                        </button>
                    </form>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <p style={{color: 'green'}}>
                        Don't have an account yet?{' '}
                        <Link
                        component="button"
                        variant="body2"
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