import React, {useState, useEffect} from "react";
import { FormControl, Input, Button, InputLabel, Box } from "@mui/material"
import { AppContext } from "../context/Context";

const EmailLink = () => {
    const { signInWithEmailLink, isSignInLink, user } = AppContext();
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleConfirm = async (e) => {
        e.preventDefault()
        try {
            await isSignInLink(displayName)
            // await signInWithEmailLink(email, window.location.href)
            console.log('User profile created', user)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2
                style={{
                    textAlign: 'center',
                    color: '#009933',
                    fontFamily: 'Playfair Display, serif',
                    margin: '1rem'
                }}
            >Confirm Your Account:</h2>
            <Box>
                <form
                    onSubmit={handleConfirm}
                >
                    <InputLabel
                    sx={{
                        color: '#009933',
                        fontFamily: 'Poppins, sans-serif',
                        margin: '1rem'
                    }}
                    htmlFor="display-name-input">Enter a display name:</InputLabel>
                    <input 
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        margin: '1rem',
                        color: 'green',
                        width: '10rem',
                        height: '2rem',
                        backgroundColor: '#f2f2f2',
                    }}
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    />
                    {/* <InputLabel
                    sx={{
                        color: '#009933',
                        fontFamily: 'Poppins, sans-serif',
                        margin: '1rem'
                    }} 
                    htmlFor="email-input">Confirm your email</InputLabel>
                    <input
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        margin: '1rem',
                        color: 'green',
                        width: '10rem',
                        height: '2rem',
                        backgroundColor: '#f2f2f2',
                    }}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    /> */}
                    <div>
                        <Button 
                        variant="contained"
                        type="submit"
                        >Confirm</Button>
                    </div>
                </form>
            </Box>
        </div>
    )
}

export default EmailLink