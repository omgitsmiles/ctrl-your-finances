import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@mui/material";

import { AppContext } from "../../context/Context";

const buttonStyle = {
    mr: 2,
    px: 4, 
    py: 1,
    fontSize: '0.9rem',
    textTransform: 'capitalize',
    borderRadius: 0,
    borderColor: '#14192d',
    color: '#fff',
    backgroundColor: '#14192d',
    "&&:hover": {
        backgroundColor: "#343a55"
    },
    "&&:focus": {
        backgroundColor: "#343a55"
    }
}

function PlaidButton() {
    const navigate = useNavigate();
    const {userId, transactions, setTransactions} = AppContext();
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newTransactions, setNewTransactions] = useState([])

    console.log("User ID is:", userId.id)

    const onSuccess = async (publicToken) => {
        console.log('onSuccess called.  User ID is:', userId.id)
        setLoading(true);
        await fetch("http://127.0.0.1:5555/api/set_access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `public_token=${publicToken}&id=${userId.id}`,
        });
        
        await plaidEndpoint('transactions');
    };

    // Creates a Link token
    const createLinkToken = useCallback(async () => {
        console.log('createLinkToken called.  User ID is:', userId.id)

        // For OAuth, use previously generated Link token
        if (window.location.href.includes("?oauth_state_id=")) {
            const linkToken = localStorage.getItem('link_token');
            setToken(linkToken);
        } else {
            const response = await fetch("http://127.0.0.1:5555/api/create_link_token", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            });
            const data = await response.json();
            setToken(data.link_token);
            localStorage.setItem("link_token", data.link_token);
        }
    }, [setToken]);


    //////////////// FROM Plaid Quickstart Endpoint ////////////
    const plaidEndpoint = async (endpoint) => {
        console.log('plaidEndpoint called.  User ID is:', userId.id)

        const response = await fetch(`http://127.0.0.1:5555/api/${endpoint}/${userId.id}`, {});
        const data = await response.json();
        if (data.error != null) {
            setError(data.error);
            return;
        }
        setNewTransactions(data)
        navigate('/dashboard')
    };
  
  
    ////////// Add newly linked account transactions to transactions stored in state /////////
    useEffect(() => {           
        let updatedTransactions = transactions ? [...transactions] : [];
        const transactionCategories = {}
        if (updatedTransactions) {
            for (let i = 0; i < updatedTransactions.length; i++) {
                const category = updatedTransactions[i].category
                transactionCategories[category] = i;
                updatedTransactions[i].amount = Number.parseFloat(updatedTransactions[i].amount)
            }
        }
        for (let transaction of newTransactions) {
            const category = transaction.personal_finance_category_primary
            const categoryIndex = transactionCategories[category]
            const transactionObj = {
                'id': transaction.id,
                'account_id': transaction.account_id,
                'amount': transaction.amount,
                'name': transaction.name,
                'primary_category': transaction.personal_finance_category_primary,
                'detail_category': transaction.personal_finance_category_detail,
            }
            if (transactionCategories.hasOwnProperty(category)) {
                updatedTransactions[categoryIndex].transactions.push(transactionObj);
                updatedTransactions[categoryIndex].amount += transactionObj.amount
            } else {
                transactionCategories[category] = updatedTransactions.length
                updatedTransactions.push({
                    category: category,
                    amount: transactionObj.amount,
                    transactions: [transactionObj]
                })
            }
        }
        setTransactions(updatedTransactions)
    }, [newTransactions])


    let isOauth = false;

    const config = {
        token,
        onSuccess,
    };

    // For OAuth, configure the received redirect URI
    if (window.location.href.includes("?oauth_state_id=")) {
        config.receivedRedirectUri = window.location.href;
        isOauth = true;
    }
    const { open, ready } = usePlaidLink(config);

    useEffect(() => {
        if (token == null) {
            createLinkToken();
        }
        if (isOauth && ready) {
            open();
        }
    }, [token, isOauth, ready, open]);

    return (
    <div>
        <Button 
            onClick={() => open()} 
            disabled={!ready}
            // variant="contained"
            sx={buttonStyle}
        >
            <strong>Link account</strong>
        </Button>
    </div>
  );
}

export default PlaidButton;