import { useState } from 'react';
import { Button, Modal, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { UserAuth } from '../../context/AuthContext';

import Login from "./Login"
import SignUp from "./SignUp"

function FrontPage() {
    const navigate = useNavigate();
    const { user } = UserAuth()

    return (
        <>
            <h1>Money Magnet</h1>
            <h3>Better Budget Management With Artificial Intelligence</h3>

            {!user ? (
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
                <Button variant="outlined" onClick={() => navigate('/login')}>Log In</Button>
            </Stack>
            ) : (
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            )
            }
        </>
    )
}

export default FrontPage