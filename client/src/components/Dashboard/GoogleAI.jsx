import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Typewriter from 'typewriter-effect';

const GoogleAI = () => {
    const [advice, setAdvice] = useState('');

    const generateAIResponse = async () => {
        try {
            const response = await fetch('http://localhost:5555/api/advice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8"',
                },
                body: `prompt=is_this_thing_working`,
            });
            const data = await response.json();
            setAdvice(data.content)
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <>
    <Button variant="contained" color="success"
        onClick={generateAIResponse}
        sx={{
            margin: '1rem auto',
            display: 'flex',
            backgroundColor: 'green',
            color: 'white',
            fontSize: '0.9rem',
            border: '1px solid green',
            fontFamily: 'Poppins, sans-serif',
        }}
        startIcon={<AutoAwesomeIcon />}>Generate AI Advice</Button>

        <Box sx={{
            display: 'flex',
            margin: '1rem auto',
            padding: '20px', 
            // border: '1px solid #ccc', 
            borderRadius: '5px',
            maxWidth: '500px', 
            color: '#009933',
        }}>
        {advice ? <Typewriter
        options={{
            delay: 0,
            strings: advice,
            autoStart: true,
            loop: false,
        }}
        /> : null}
        </Box>
    </>
  )
}

export default GoogleAI