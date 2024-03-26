import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Typewriter from 'typewriter-effect';
import { AppContext } from '../../context/Context';

const GoogleAI = () => {
    const [advice, setAdvice] = useState('');
    const { transactions } = AppContext();
    const transactionArray = transactions.map((transaction) => `${transaction.category}: ${transaction.amount}`);
    console.log(transactionArray)

    const generateAIResponse = async () => {
        try {
            const response = await fetch('http://localhost:5555/api/advice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8"',
                },
                body: `prompt=using_${transactionArray}_find_ways_to_save_money`,
            });
            const data = await response.json();
            setAdvice(data.content)
        } catch (error) {
            console.error(error);
        }
    }

    console.log(advice, transactions)

    const buttonStyle = {
        margin: '1rem auto',
        display: 'flex',
        backgroundColor: 'green',
        color: 'white',
        fontSize: '0.9rem',
        border: '1px solid green',
        fontFamily: 'Poppins, sans-serif',
        "&&:hover": {
            backgroundColor: "white",
            color: "green",
            
        },
        "&&:focus": {
            backgroundColor: "white",
            color: "green",
            
        }
    }


  return (
    <>
    <Button variant="contained" color="success"
        onClick={generateAIResponse}
        sx={
            buttonStyle
        }
        startIcon={<AutoAwesomeIcon />}>Generate AI Advice</Button>

        <Box sx={{
            display: 'flex',
            margin: '1rem auto',
            padding: '10px',
            paddingBlock: '0px', 
            maxWidth: '500px', 
            color: '#009933',
        }}>
        {advice ? <Typewriter
        options={{
            strings: [advice],
            autoStart: true,
            loop: false,
            // pauseFor: 1000000,
        }}
        /> : null}
        </Box>
    </>
)
}

export default GoogleAI