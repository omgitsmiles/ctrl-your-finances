import { useState } from 'react';
import { Box, FormControl, FormControlLabel, ListItem, ListItemButton, ListItemText, Modal, Switch, Typography } from '@mui/material';

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

const initialChecks = {
    accounts: true,
    spending: true,
    goals: true,
}

function HouseMember({houseMember}) {
    const [checked, setChecked] = useState(initialChecks);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleChange(event) {
        setChecked({
            ...checked,
            [event.target.name]: event.target.checked,
        });
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
            >
                <Box sx={style}>
                    <Typography >Permissions</Typography>
                    <FormControl>
                        <FormControlLabel 
                            control={
                                <Switch checked={checked.accounts} onChange={handleChange} name="accounts" />
                            } 
                            label="Manage Household Accounts" 
                        />
                        <FormControlLabel 
                            control={
                                <Switch 
                                    checked={checked.spending} 
                                    onChange={handleChange} 
                                    name="spending" 
                                />
                            } 
                            label="View Spending" 
                        />
                        <FormControlLabel 
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
                </Box>
            </Modal>
        </div>
    )
}

export default HouseMember