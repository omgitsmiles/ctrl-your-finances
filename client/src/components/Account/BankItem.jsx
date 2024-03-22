
import { useState } from 'react';
import { Box, FormControl, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Stack, Switch, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

function BankItem({account}) {
    const [checked, setChecked] = useState(true);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleSwitched(event) {
        setChecked(event.target.checked)
    }

    return (
        <div>
            <ListItem disablePadding >
                <ListItemButton onClick={handleOpen} >
                    <ListItemText primary={account.name} />
                </ListItemButton>
                <ListItemIcon>
                    <IconButton aria-label="delete account">
                        <DeleteForeverIcon />
                    </IconButton>
                </ListItemIcon>
            </ListItem>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="account management"
                aria-describedby="account management"
            >
                <Box sx={style}>
                    <Typography >Manage Account</Typography>
                    <FormControl>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Private</Typography>
                            <Switch 
                                checked={checked}
                                onChange={handleSwitched} 
                                inputProps={{ 'aria-label': 'account sharing' }} 
                            />
                            <Typography>Household</Typography>
                        </Stack>
                    </FormControl>
                </Box>
            </Modal>
        </div>
    )
}

export default BankItem