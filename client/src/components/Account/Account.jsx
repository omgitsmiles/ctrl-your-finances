import { useContext, useEffect, useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom";
import { Box, List, Typography, Button, ListItem } from "@mui/material"
import Input from '@mui/material/Input';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from "@mui/system";

import BankItem from "./BankItem";
import HouseMember from "./HouseMember";
import PlaidButton from "../Plaid/PlaidButton";
import InviteMemberModal from "./InviteMemberModal";

import { AppContext } from "../../context/Context";

function Account() {
    const { user, bankAccounts, setBankAccounts, houseMembers, setHouseMembers, error, setError, signInWithLink } = AppContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const handleSendEmailLink = async () => {
        
        try {
            await signInWithLink(email)
            setOpenInvite(false)
            console.log('Email sent')
        } catch (error) {
            console.log(error)
        }
    }

    const accountList = bankAccounts ? bankAccounts?.map((account) => {
        return <BankItem key={account.id} account={account} setBankAccounts={setBankAccounts} setError={setError} />
    }) : null;

    const householdList = houseMembers ? houseMembers?.map((member) => {
        return <HouseMember key={member.id} houseMember={member} />
    }) : null;

    const HouseholdButton = styled(Button)(() => ({
        margin: '1rem auto',
        display: 'flex',
        backgroundColor: 'green',
        color: 'white',
        fontSize: '0.9rem',
        border: '1px solid green',
        fontFamily: 'Poppins, sans-serif',
        "&:hover": {
            backgroundColor: "white",
            color: "green",
            
        },
        "&:focus": {
            backgroundColor: "white",
            color: "green",
            
        }
    }))

    // tab value state
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [openInvite, setOpenInvite] = useState(false);

    const handleOpenInvite = () => setOpenInvite(true);

    // invite modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {xs:'70%', sm: '60%', md: '60%', lg: '40%', xl: '30%'},
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 5,
        p: 4,
        color: 'green',
        fontSize: {xs: '.5rem', sm: '1rem', md: '1.2rem'},
        };

    return (
        <main>
            <div 
            style={{
                display: 'flex', 
                justifyContent: 'center'
            }}
            >
            <h1
            style={{
                textAlign: 'center', 
                color: 'green', 
                fontSize: '2.5rem', 
                margin: '1rem',
                fontFamily: 'Playfair Display, serif',
                backgroundColor: '#bce5af',
                padding: '1rem',
                borderRadius: '15px',
                boxShadow: '2px 2px 8px 2px #888888',
                width: '75%',
            }}
            >Account Management</h1>
            </div>
            <TabContext value={value}>
                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center', 
                }}>
                    <TabList 
                        onChange={handleChange} 
                        aria-label="account management tabs" 
                        
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Bank Accounts" value="1" />
                        <Tab label="Household Members" value="2" />
                        <Tab label="Account Settings" value="3" />
                    </TabList>
                </Box>

                <TabPanel value="1">
                    <Typography
                    style={
                        {textAlign: 'center', 
                        color: 'green', 
                        fontSize: '1.8rem', 
                        margin: '1rem 0',
                        fontFamily: 'Poppins',
                        textDecoration: 'underline',
                    }}
                    >Linked Bank Accounts</Typography>
                    <PlaidButton>
                        Add an Account
                    </PlaidButton>
                    <Box
                        sx={{ 
                            width: '100%', 
                            maxWidth: 360, 
                            // bgcolor: '#bce5af', 
                            color: 'green',
                            fontFamily: 'Poppins'}}
                        aria-label="linked accounts"
                    >
                        <List>
                            {accountList}
                        </List>
                    </Box>
                </TabPanel>

                <TabPanel value="2">
                    <Typography
                    style={
                        {textAlign: 'center', 
                        color: 'green', 
                        fontSize: '1.8rem', 
                        margin: '1rem 0',
                        fontFamily: 'Poppins',
                        textDecoration: 'underline',
                    }
                    }
                    >Household Members</Typography>
                    <HouseholdButton
                        variant='contained'
                        size='medium'
                        startIcon={<AddIcon />}
                        onClick={handleOpenInvite}
                    >Add a Member</HouseholdButton>
                    <Box
                        sx={{ 
                            width: '100%', 
                            maxWidth: 360, 
                            // bgcolor: '#bce5af', 
                            color: 'green' }}
                        aria-label="household members"
                    >
                        <List
                            style={{
                                padding: '0',
                                margin: '0',
                                fontFamily: 'Poppins',
                                fontSize: '1rem',
                            }}
                        >
                            {householdList}
                        </List>
                    </Box>
                </TabPanel>

                <TabPanel value="3">
                    <Typography
                    style={
                        {textAlign: 'center', 
                        color: 'green', 
                        fontSize: '1.8rem', 
                        margin: '1rem 0',
                        fontFamily: 'Poppins',
                        textDecoration: 'underline',
                    }}
                    >Account Settings</Typography>
                    <List>
                        <ListItem
                            sx={
                                {color: 'green',
                                borderBottom: 'green 1px solid',
                                }
                            }
                        >Reset Email/Password</ListItem>
                        <ListItem
                            sx={
                                {color: 'green',
                                borderBottom: 'green 1px solid',
                                }
                            }
                        >Set Up Two-Factor Authentication</ListItem>
                        <ListItem
                            sx={
                                {color: 'green',
                                borderBottom: 'green 1px solid',
                                }
                            }
                        >Delete Account</ListItem>
                    </List>
                </TabPanel>
            
            </TabContext>

            <Modal
                open={openInvite}
                onClose={() => setOpenInvite(false)}
                aria-labelledby="invite-member-modal-title"
                aria-describedby="invite-member-modal-description"
            >
                <Box sx={style}>
                    {/* <h2 id="modal-modal-title">Invite a Member</h2> */}
                    <Button
                        onClick={() => setOpenInvite(false)}
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            marginTop: '1rem',
                            marginRight: '1rem',
                            color: 'green',
                            backgroundColor: 'white',
                            // fontSize: '1rem',
                            borderRadius: '5px',
                            // border: '1px solid green',
                            fontFamily: 'Poppins',
                            "&:hover": {
                                backgroundColor: "green",
                                color: "white",
                                
                            },
                            "&:focus": {
                                backgroundColor: "green",
                                color: "white",
                                
                            }
                        }}
                    >
                        <ClearIcon
                            fontSize="medium"
                        />
                    </Button>
                    <p id="modal-modal-description" style={{fontSize: '1rem'}}>Invite a member to join your house.</p>
                    <Input 
                        type="email" 
                        placeholder="Enter new member's email address" 
                        sx={{
                            width: '100%',
                            padding: '0.5rem',
                            // margin: '1rem 1rem',
                            fontSize: '.75rem',
                            fontFamily: 'Poppins',
                            borderRadius: '5px',
                            backgroundColor: '#f0f0f0',
                            color: 'green',
                        }}
                        margin="dense"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <Button 
                        variant="contained"
                        style={
                            {margin: '1rem auto',
                            display: 'flex',
                            backgroundColor: 'green',
                            color: 'white',
                            fontSize: {xs: '.5rem', sm: '1rem', md: '1.2rem'},
                            border: '1px solid green',
                            fontFamily: 'Poppins, sans-serif',
                            }
                        }
                        onClick={handleSendEmailLink}
                        type="submit"
                    >Invite</Button>
                </Box>
            </Modal>

        </main>
    )
}

export default Account