import { useState } from 'react';
import { Button,  Modal, Stack, Box, styled, Typography } from '@mui/material';
import Login from "./Login"
import SignUp from "./SignUp"
import Philosophy from './Philosophy';
import Header from './Header';
import Footer from '../Footer';

function FrontPage() {
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    const handleOpenSignUp = () => setOpenSignUp(true);
    const handleCloseSignUp = () => setOpenSignUp(false);

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);


    return (
        <>
            {/* <h1>Welcome to Money Magnet!</h1>
            <h3>Better Budget Management With Artificial Intelligence</h3>

            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleOpenSignUp}>Sign Up</Button>
                <Button variant="outlined" onClick={handleOpenLogin}>Log In</Button>
            </Stack> */}

            {/* <Modal
                open={openSignUp}
                onClose={handleCloseSignUp}
                aria-labelledby="modal-signup"
                aria-describedby="sign up form"
            >
                <SignUp />
            </Modal>

            <Modal
                open={openLogin}
                onClose={handleCloseLogin}
                aria-labelledby="modal-login"
                aria-describedby="login form"
            >
                <Login />
            </Modal> */}

             <Header />
             <Philosophy />
             <Footer />
        </>
    )
}

export default FrontPage