import React, { useEffect } from 'react';
import { GoogleButton } from 'react-google-button';
import { Box, Button } from "@mui/material";
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
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user != null) {
            navigate('/account')
        }
    }, [user])

    return (
        <Box>
            <h2>Sign In</h2>
            <GoogleButton onClick={handleGoogleSignIn} />
        </Box>
    )
}

export default Login