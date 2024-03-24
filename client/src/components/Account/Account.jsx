import { useContext, useEffect, useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom";
import { Box, List, Typography, Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

import BankItem from "./BankItem";
import HouseMember from "./HouseMember";

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

    return (
        <>
            <h1
            style={{
                textAlign: 'center', 
                color: 'green', 
                fontSize: '2.5rem', 
                margin: '1rem 0'
            }}
            >Account Management</h1>
            <Typography
            style={
                {textAlign: 'center', 
                color: 'green', 
                fontSize: '1.5rem', 
                margin: '1rem 0'}
            }
            >Linked Bank Accounts</Typography>
            <Button
                style={{
                    margin: '1rem auto',
                    display: 'flex',
                    backgroundColor: 'green',
                    color: 'white'
                }}
                variant='contained'
                size='medium'
                startIcon={<AddIcon />}
                onClick={() => navigate('/link')}
            >
                Add an Account
            </Button>
            <Box
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'primary.main' }}
                aria-label="linked accounts"
            >
                <List>
                    {accountList}
                </List>
            </Box>
            <Typography
            style={
                {textAlign: 'center', 
                color: 'green', 
                fontSize: '1.5rem', 
                margin: '1rem 0'}
            }
            >Household Members</Typography>
            <Button
                style={{
                    margin: '1rem auto',
                    display: 'flex',
                    backgroundColor: 'green',
                    color: 'white'
                }}
                variant='contained'
                size='medium'
                startIcon={<AddIcon />}
            >Add a Member</Button>
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