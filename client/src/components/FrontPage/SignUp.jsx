import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";

// import PlaidLink from "../PlaidLink";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function SignUp() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={style}>
            <h2>Sign Up Form Here</h2>
            <Button variant="outlined" onClick={handleOpen}>Successful signup would redirect to Plaid Link as a modal or new route</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <PlaidLink />
                </Box>
            </Modal>
        </Box>
    )
}

export default SignUp