import React, { useEffect, useState } from 'react';
import { GoogleButton } from 'react-google-button';
import { Box, Button } from "@mui/material";
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

const Login = () => {

    const { googleSignIn, user } = UserAuth();
    const [openEmailSignUp, setOpenEmailSignUp] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }
    const handleEmailClickOpen = () => {
        setOpenEmailSignUp(true);
    };

    useEffect(() => {
        if (user != null) {
            navigate('/dashboard')
        }
    }, [user])

    return (
        <main>
        <Box>
            <h2>Sign In</h2>
            <GoogleButton onClick={handleGoogleSignIn} />
            <Button 
                style={{maxWidth: '250px', maxHeight: '40px', minWidth: '250px', minHeight: '40px'}}
                size="large" 
                variant='outlined' 
                startIcon={<AccountCircleIcon />}
                onClick={handleEmailClickOpen}
            >
                    Sign up with email
            </Button>
        </Box>
        {openEmailSignUp ? (
            <section>
                <div>
                    <div>                                  
                        <form> 
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                {/* <input
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}  
                                    required
                                    placeholder="Email address" 
                                /> */}
                            </div>
                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                {/* <input
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="Password"              
                                /> */}
                            </div>  
                            <div>
                                <label htmlFor="confirm-password">
                                Confirm Password
                                </label>
                                {/* <input
                                    type="password"
                                    label="Confirm password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="Password"              
                                /> */}
                            </div>      
                            <button
                                type="submit" 
                                onClick={console.log('clicked')}                        
                            >  
                                Sign up                                
                            </button>
                        </form>
                        <p>
                            Don't have an account yet?{' '}
                            <Link
                            component="button"
                            variant="body2"
                            href="/signup" 
                            >
                            Sign up
                            </Link>
                        </p>                   
                    </div>
                </div>
            </section>
        
    ) : (<div></div>)
    }
        
        </main>
    )
}

export default Login