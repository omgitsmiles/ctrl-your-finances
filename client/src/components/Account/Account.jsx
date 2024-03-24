import { useContext, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom";
import { Box, List, Typography } from "@mui/material"

import BankItem from "./BankItem";
import HouseMember from "./HouseMember";

import { AppContext } from "../../context/Context";

function Account() {
    const { user, bankAccounts, setBankAccounts, houseMembers, setHouseMembers, error, setError } = AppContext();

    const accountList = bankAccounts ? bankAccounts.map((account) => {
        return <BankItem key={account.id} account={account} setBankAccounts={setBankAccounts} setError={setError} />
    }) : null;

    const householdList = houseMembers ? houseMembers.map((member) => {
        return <HouseMember key={member.id} houseMember={member} />
    }) : null;

    return (
        <>
            <h1>Account Management</h1>
            <Typography>Linked Accounts</Typography>
            <Box
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'primary.main' }}
                aria-label="linked accounts"
            >
                <List>
                    {accountList}
                </List>
            </Box>

            <Typography>Household Members</Typography>
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