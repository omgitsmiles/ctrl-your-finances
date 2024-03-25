import { useContext, useEffect, useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom";
import { Box, List, Typography, Button, ListItem } from "@mui/material"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import { styled } from "@mui/system";

import BankItem from "./BankItem";
import HouseMember from "./HouseMember";
import PlaidButton from "../Plaid/PlaidButton";

import { AppContext } from "../../context/Context";

function Account() {
    const { user, bankAccounts, setBankAccounts, houseMembers, setHouseMembers, error, setError } = AppContext();
    const navigate = useNavigate();

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
        </main>
    )
}

export default Account