// React imports
import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Firebase imports
import { UserAuth } from '../../context/AuthContext';

// Material UI imports
import CssBaseline from "@mui/material/CssBaseline";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';

    
const SignUp = () => {
    const navigate = useNavigate();

    const [openEmailSignUp, setOpenEmailSignUp] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { createUserWithEmail } = UserAuth();

    const handleEmailClickOpen = () => {
        setOpenEmailSignUp(true);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmail(name, email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }
    }
    
    return (
        <main>   
            <Stack 
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ minWidth: 12 }}
            >
                    <h1>Sign up</h1>
                    <Button 
                    style={{maxWidth: '250px', maxHeight: '40px', minWidth: '250px', minHeight: '40px'}}
                    size="large" 
                    variant='outlined' 
                    startIcon={<AccountCircleIcon />}
                    onClick={handleEmailClickOpen}
                    >
                        Sign up with email
                    </Button>
                    <Button 
                    style={{maxWidth: '250px', maxHeight: '60px', minWidth: '250px', minHeight: '40px'}}
                    size="medium" variant='outlined' startIcon={<GoogleIcon/>}>
                        Continue with Google
                    </Button>
                    
                    <p>Already have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            href="/login" 
                            >
                            Log in
                        </Link>
                    </p>
            </Stack>
            {openEmailSignUp ? (
            <section>
                <div>
                    <div>
                        <form onSubmit={handleSubmit}> 
                            <div>
                                <label htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Name"
                                />
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                            </div>
                            <div>
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
                            <div>
                                <label htmlFor="confirm-password">
                                Confirm Password
                                </label>
                                <input
                                    type="password"
                                    label="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    placeholder="Confirm Password"              
                                />
                            </div>      
                            <button>  
                                Sign up
                            </button>
                        </form>
                        <p>
                            Already have an account?{' '}
                            <Link
                            component="button"
                            variant="body2"
                            href="/login" 
                            >
                            Log in
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
    
export default SignUp;
