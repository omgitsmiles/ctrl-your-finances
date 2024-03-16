// React imports
import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Firebase imports
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../../firebase';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
// const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(props.auth)

// Material UI imports
import CssBaseline from "@mui/material/CssBaseline";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';


    
const SignUp = () => {
        const navigate = useNavigate();
    
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('');
    
        const onSubmit = async (e) => {
        e.preventDefault()
        
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
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
                    size="large" variant='outlined' startIcon={<AccountCircleIcon />}>
                        Sign up with email
                    </Button>
                    <Button 
                    style={{maxWidth: '250px', maxHeight: '60px', minWidth: '250px', minHeight: '40px'}}
                    size="medium" variant='outlined' startIcon={<GoogleIcon/>}>
                        Continue with Google
                    </Button>
                    <Button  
                    style={{maxWidth: '250px', maxHeight: '60px', minWidth: '250px', minHeight: '40px'}}
                    size="medium" variant='outlined' startIcon={<FacebookIcon/> }>
                        Continue with Facebook
                    </Button>
                    <p>Already have an account? <a>Login</a></p>
            </Stack>

             
            <section>
                <div>
                    <div>                                  
                        <form>                                                                                            
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
                            
                            <button
                                type="submit" 
                                onClick={onSubmit}                        
                            >  
                                Sign up                                
                            </button>
                                                                        
                        </form>
                    
                        <p>
                            Already have an account?{' '}
                            <NavLink to="/" >
                                Sign in
                            </NavLink>
                        </p>                   
                    </div>
                </div>
            </section>
        </main>
    )
    }
    
export default SignUp







