import { useContext, useEffect, useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom";
import { Box, List, Typography, Button } from "@mui/material"
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

    return (
        <>
            <h1
            style={{
                textAlign: 'center', 
                color: 'green', 
                fontSize: '2.5rem', 
                margin: '1rem 0',
                fontFamily: 'Playfair Display, serif'
            }}
            >Account Management</h1>
            <Typography
            style={
                {textAlign: 'center', 
                color: 'green', 
                fontSize: '1.5rem', 
                margin: '1rem 0',
                fontFamily: 'Poppins'}
            }
            >Linked Bank Accounts</Typography>
            <PlaidButton>
                Add an Account
            </PlaidButton>
            <Box
                sx={{ 
                    width: '100%', 
                    maxWidth: 360, 
                    // bgcolor: '#bce5af', 
                    color: 'green' }}
                aria-label="linked accounts"
            >
                <List
                    style={{
                        padding: '0',
                        margin: '0',
                        fontFamily: 'Poppins',
                        fontSize: '1rem'
                    }}
                >
                    {accountList}
                </List>
            </Box>
            <Typography
            style={
                {textAlign: 'center', 
                color: 'green', 
                fontSize: '1.5rem', 
                margin: '1rem 0',
                fontFamily: 'Poppins'
            }
            }
            >Household Members</Typography>
            <HouseholdButton
                variant='contained'
                size='medium'
                startIcon={<AddIcon />}
            >Add a Member</HouseholdButton>
            <Box
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'primary.main' }}
                aria-label="household members"
            >
                <List>
                    {householdList}
                </List>
            </Box>
        </>
    )
}

export default Account