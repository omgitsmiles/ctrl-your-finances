
import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Stack, Switch, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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

function BankItem({account, setBankAccounts, setError}) {
    const [checked, setChecked] = useState(false);
    const [saveChanges, setSaveChanges] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
        console.log(account)
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        // requestMethod = checked ? 'POST' : 'DELETE';
        // fetch(`http://127.0.0.1:5555/api/household/accounts/${account.id}`, {
        //     method: requestMethod
        // })
    };

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const handleOpenConfirmation = () => {setOpenConfirmation(true)}
    const handleCloseConfirmation = () => {setOpenConfirmation(false)}

    function handleSwitched(event) {
        setChecked(event.target.checked)
        setSaveChanges(true)
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

    const StyledIconButton = styled(IconButton)(() => ({
        '&:hover': {
            backgroundColor: '#FDF4F7'
        }
    }))

    return (
        <div>
            <ListItem
                sx={
                    {color: 'green',
                    borderBottom: 'green 1px solid',
                    }
                }
                disablePadding 
            >
                <ListItemButton onClick={handleOpenModal} >
                    <ListItemText 
                        
                        primary={account.name} 
                    />
                </ListItemButton>
                <ListItemIcon>
                    <StyledIconButton 
                        onClick={handleOpenConfirmation}
                        aria-label="delete bank account"
                    >
                        <DeleteForeverIcon
                            style={{
                                color: '#960018'
                            }}
                        />
                    </StyledIconButton>
                </ListItemIcon>
            </ListItem>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="account management"
                aria-describedby="account management"
                style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center'}}
            >
                <Box sx={style}>
                    <Typography
                        style={
                            {textAlign: 'center',
                            color: 'green',
                            fontSize: '1.8rem',
                            fontFamily: 'Poppins',
                            margin: '1rem, 1rem'
                            }}
                    >Manage Account</Typography>
                    <FormControl>
                        <p
                            style={{
                                fontSize: '1.2rem',
                                fontFamily: 'Poppins',
                                textAlign: 'center',
                                textDecoration: 'underline',
                                marginTop: '1rem'
                            }}
                        >Account Visibility: </p>
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
                    <Button
                        style={{
                            // backgroundColor: 'white',
                            color: 'green',
                            marginLeft: '1rem',
                            border: 'none',
                            fontFamily: 'Poppins'
                        }}
                        disabled={!saveChanges}
                        onClick={handleCloseModal}
                    >
                        Save Changes
                    </Button>
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