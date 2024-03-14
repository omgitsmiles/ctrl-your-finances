import { Box, Button } from "@mui/material";

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

function Login() {

    return (
        <Box sx={style}>
            <h2>Login Form Here</h2>
            <Button variant="contained">Log In</Button>
        </Box>
    )
}

export default Login