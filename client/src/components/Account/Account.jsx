import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom";
import { Box, List } from "@mui/material"

import BankItem from "./BankItem";
import HouseMember from "./HouseMember";

function Account() {
    const { bankAccounts, houseMembers, household, error } = useOutletContext();

    console.log('Bank Accounts:', bankAccounts)
    console.log('Household:', household)
    console.log('Household members:', houseMembers)

    const accountList = bankAccounts ? bankAccounts.map((account) => {
        return <BankItem key={account.id} account={account} />
    }) : null;

    const householdList = houseMembers ? houseMembers.map((member) => {
        return <HouseMember key={member.id} houseMember={member} />
    }) : null;

    return (
        <>
            <h1>Account Management</h1>
            <Box
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="linked accounts"
            >
                <List>
                    {accountList}
                </List>
            </Box>

            <Box
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
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