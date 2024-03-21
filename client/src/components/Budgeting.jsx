import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';



// grab user data and have house account toggle for different 

function Budgeting() {
    const [goalName, setGoalName] = useState("");
    const [savedMoney, setSavedMoney] = useState(0);
    const [targetAmount, setTargetAmount] = useState(0);

    useEffect(() => {
      // fetch user's goals from backend
      fetchUserGoals();
    },[])

    const fetchUserGoals = async () => {
      try {
        
      }
    }


    const [data, setData] = useState({
      old: [
        ["Name", "Goal"],
        ["Car", 1250],
      ],
      new: [
        ["Name", "Money Saved"],
        ["Car", 370],
      ],
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();

        const newGoal = [goalName, targetAmount];
        const newSaved = [goalName, savedMoney];
        const newDataOld = [...data.old, newGoal]
        const newDataNew = [...data.new, newSaved]

    //   const newDataOld = [...data.old, [goalName, targetAmount]];
    //   const newDataNew = [...data.new, [goalName, savedMoney]];

      setData({ old: newDataOld, new: newDataNew });

        // const newGoal = { name: goalName, goal: targetAmount};
        // setGoals([...goals, newGoal])

        setGoalName("");
        setSavedMoney(0);
        setTargetAmount(0);
    };
  
    const options = {
      legend: { position: "top" },
      colors: ["#009933"], // Adjust color as needed
    };
  

    return (
        <div>
                <Box
        sx={{
        padding: '20px', 
        border: '1px solid #ccc', // Add border to create a box effect
        borderRadius: '5px', // Add border radius for rounded corners
        maxWidth: '500px', // Limit the width of the box
        // marginRight: 'auto', // Center the box horizontally
        }}
      >
            <h1 style={{fontFamily: 'Poppins', color: '#009933'}}>BUDGETING GOALS</h1>
            <h2 style={{ fontFamily: 'Poppins', color: '#32004C' }}>Set Your Financial Goals</h2>
            <p style={{ fontFamily: 'Poppins', color: '#32004C' }}>Start your journey towards financial well-being today. Define clear, achievable goals that align with your aspirations and values.</p>

        
    <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ display: 'block' }} // Set display to block to stack elements vertically
    >
        <TextField
            label="What are you saving for"
            fullWidth
            id="outlined-start-adornment"
            sx={{ m: 1, width: '100%', display: 'block' }} 
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
        />

        <FormControl sx={{ m: 1, width: '100%', display: 'block' }}> 
            <InputLabel htmlFor="outlined-adornment-amount">Saved</InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                fullWidth
                type="number"
                value={savedMoney}
                onChange={(e) => setSavedMoney(parseInt(e.target.value))}
            />
        </FormControl>

        <FormControl sx={{ m: 1, width: '100%', display: 'block' }} > 
            <InputLabel htmlFor="outlined-adornment-amount">Target</InputLabel>
            <OutlinedInput
                id="outlined-adornment-amount"
                fullWidth
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(parseInt(e.target.value))}
            />
        </FormControl>
        
        <Button
            type="submit"
            variant="contained"
            size="large"
            style={{ backgroundColor: "#009933", marginTop: '10px' }}
            fullWidth
        >
            Add Goal
        </Button>
    </form>
</Box>



        <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            diffdata={data}
            options={options}
        />
        </div>
    )
}

export default Budgeting

