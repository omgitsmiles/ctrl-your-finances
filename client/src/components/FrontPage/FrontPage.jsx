import { useState } from 'react';
import { Button, Modal, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

import Login from "./Login"
import SignUp from "./SignUp"

function FrontPage() {
    const navigate = useNavigate();

    // const [openSignUp, setOpenSignUp] = useState(false);
    // const [openLogin, setOpenLogin] = useState(false);

    // const handleOpenSignUp = () => {
    //     navigate('/signup')
    // }
    

    // const handleOpenLogin = () => {
    //     navigate('/login')
    // }
    // const handleCloseLogin = () => setOpenLogin(false);

    

    

    return (
        <>
            <h1>Money Magnet</h1>
            <h3>Better Budget Management With Artificial Intelligence</h3>

            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
                <Button variant="outlined" onClick={() => navigate('/login')}>Log In</Button>
            </Stack>

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
        </>
    )
}

export default FrontPage