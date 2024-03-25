// React imports
import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Firebase imports
import { AppContext } from '../../context/Context';

// Material UI imports
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';
import { styled } from '@mui/system';

    
const SignUp = () => {
    const navigate = useNavigate();

    const [openEmailSignUp, setOpenEmailSignUp] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { createUserWithEmail, googleSignIn, user, setUser } = AppContext();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    }

    const handleEmailClickOpen = () => {
        setOpenEmailSignUp(true);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setError('')
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match.")
                return;
            }
            await createUserWithEmail(name, email, password, (error) => {
                if (error) {
                    let errorMessage = error.message;
                    if (errorMessage.includes('(auth/weak-password)')) {
                        errorMessage = "Password should be at least 6 characters.";
                }
                setError(errorMessage);
                console.log("Sign up error:", errorMessage)
            }
                else {
                    navigate('/dashboard');
                }
            });
        } catch (error) {
            setError(error.message);
            console.log("Unexpected Error:", error);
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
            {!openEmailSignUp ? (
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
                    marginBottom: '.4rem'
                    }
                }
            >
                Budgeting, Your Way
            </h2>  
                
                <ColorButton startIcon={<AccountCircleIcon />}
                onClick={handleEmailClickOpen}
                >
                    Sign up with email
                </ColorButton>
                <ColorButton startIcon={<GoogleIcon/>}
                onClick={handleGoogleSignIn}
                >
                    Continue with Google
                </ColorButton>
                <p style={{color: 'green'}}>
                    Already have an account?{' '}
                    <Link
                    component="button"
                    style={{
                        color: '#637099'
                    }}
                    to="/login" 
                    >
                        Log in
                    </Link>
                </p>
            </Stack>
            ) : (
            <section>
                <Button 
                    onClick={() => {setOpenEmailSignUp(false)}}
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
                    >Sign Up</h2>
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
                                htmlFor="name"
                                style={labelStyle}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Name"
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
                        <div
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                paddingTop: '.5rem'
                            }}
                        >
                            <label 
                                htmlFor="confirm-password"
                                style={labelStyle}
                            >
                            Confirm Password
                            </label>
                            <input
                                type="password"
                                label="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                placeholder="Confirm Password"
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
                            size='large'
                            type='submit'
                        >  
                            Sign up
                        </Button>
                    </form>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <p style={{
                        color: 'green',
                        fontSize: '.9rem',
                        marginTop: '.5rem'
                    }}>
                        Already have an account?{' '}
                        <Link
                        component="button"
                        style={{
                            color: '#637099'
                        }}
                        to="/login" 
                        >
                        Log in
                        </Link>
                    </p>
                </div>
            </section>
            )}
    </main>
    )
}
    
export default SignUp;
