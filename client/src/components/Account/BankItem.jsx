
import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Stack, Switch, Typography } from '@mui/material';
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
    color: 'primary.main'
  };

function BankItem({account, setBankAccounts, setError}) {
    const [checked, setChecked] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        requestMethod = checked ? 'POST' : 'DELETE';
        fetch(`http://127.0.0.1:5555/api/household/accounts/${account.id}`, {
            method: requestMethod
        })
    };

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const handleOpenConfirmation = () => {setOpenConfirmation(true)}
    const handleCloseConfirmation = () => {setOpenConfirmation(false)}

    function handleSwitched(event) {
        setChecked(event.target.checked)
    }

    function handleDelete() {
        console.log(account);
        handleCloseConfirmation();
        fetch(`http://127.0.0.1:5555/api/plaiditem/${account.plaid_item_id}`, {
            method: 'DELETE'
        })
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(message => {
                    console.log(message.message)
                    setBankAccounts((currentAccounts) => currentAccounts.filter(acc => {
                        if (acc.plaid_item_id !== account.plaid_item_id) return acc
                    }))  
                })
            }
            else {
                resp.json()
                .then(message => setError(message.error))
            }
        })
    }

    return (
        <div>
            <ListItem disablePadding >
                <ListItemButton onClick={handleOpenModal} >
                    <ListItemText primary={account.name} />
                </ListItemButton>
                <ListItemIcon>
                    <IconButton 
                        onClick={handleOpenConfirmation}
                        aria-label="delete bank account"
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                </ListItemIcon>
            </ListItem>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
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

            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="delete-account-alert-dialog"
                aria-describedby="delete account alert dialog"
            >
                <DialogTitle>
                    {"Remove Account and Related Accounts?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Removing this account from your Money Magnet account will also remove any other accounts you have linked this account's bank.  Any transactions related to this account and the related linked bank accounts will be removed from your Money Magnet account as well.  Please confirm that you want to remove this account and related accounts.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Cancel</Button>
                    <Button onClick={handleDelete}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default BankItem