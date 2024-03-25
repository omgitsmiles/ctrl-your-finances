import { useState } from 'react';
import { Box, FormControl, FormControlLabel, ListItem, ListItemButton, ListItemText, Modal, Switch, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';  

const style = {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    margin: '4rem',
    padding: '1rem',
    border: '1px solid green',
    width: '400px',
    backgroundColor: '#A0DB8E'
};

const LabelStyle = styled(FormControlLabel)(() => ({
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: '1.2rem',
}));

const initialChecks = {
    accounts: true,
    spending: true,
    goals: true,
}

function HouseMember({houseMember}) {
    const [checked, setChecked] = useState(initialChecks);
    const [open, setOpen] = useState(false);
    const [saveChanges, setSaveChanges] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleChange(event) {
        setChecked({
            ...checked,
            [event.target.name]: event.target.checked,
        });
        setSaveChanges(true);
        
    };

    return (
        <div>
            <ListItem disablePadding>
                <ListItemButton onClick={handleOpen} >
                    <ListItemText primary={houseMember.name} />
                </ListItemButton>
            </ListItem>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="household member settings"
                aria-describedby="manage household member permissions"
                style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    fontFamily: 'Poppins'
                }}
            >
                <Box sx={style}>
                    <Typography
                        style={
                            {textAlign: 'center',
                            color: 'green',
                            fontSize: '1.5rem',
                            fontFamily: 'Poppins',
                            margin: '1rem, 1rem'
                            }}
                    >{houseMember.name}'s Permissions</Typography>
                    <FormControl>
                        <LabelStyle
                            
                            control={
                                <Switch checked={checked.accounts} onChange={handleChange} name="accounts" />
                            } 
                            label="Manage Household Accounts" 
                        />
                        <LabelStyle 
                            control={
                                <Switch 
                                    checked={checked.spending} 
                                    onChange={handleChange} 
                                    name="spending" 
                                />
                            } 
                            label="View Spending" 
                        />
                        <LabelStyle 
                            control={
                                <Switch 
                                    checked={checked.goals} 
                                    onChange={handleChange} 
                                    name="goals"
                                />
                            } 
                            label="View and Edit Goals" 
                        />
                    </FormControl>
                    <Button
                        style={{
                            // backgroundColor: 'white',
                            color: 'green',
                            marginLeft: '1rem',
                            border: 'none',
                            fontFamily: 'Poppins'
                        }}
                        disabled={!saveChanges}
                        onClick={handleClose}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default HouseMember