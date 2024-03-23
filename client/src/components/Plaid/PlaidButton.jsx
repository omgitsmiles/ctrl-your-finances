import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaidLink } from "react-plaid-link";

import { UserAuth } from "../../context/AuthContext" 

function PlaidButton() {
    const {transactions, setTransactions} = UserAuth();
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const onSuccess = useCallback(async (publicToken) => {
        setLoading(true);
        await fetch("http://127.0.0.1:5555/api/set_access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_token: publicToken }),
        });
        await plaidEndpoint('transactions');
        navigate('/dashboard')
    }, []);

    // Creates a Link token
    const createLinkToken = useCallback(async () => {
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
        const response = await fetch(`http://127.0.0.1:5555/api/${endpoint}`, {});
        const data = await response.json();
        if (data.error != null) {
            setError(data.error);
            return;
        }
        // console.log(data)
        updateTransactions(data)
    };
  
  
    ////////// Add newly linked account transactions to transactions stored in state /////////
    function updateTransactions(data) {
        let updatedTransactions = transactions ? transactions : [];

        const transactionCategories = {}
        if (updatedTransactions) {
            for (let i = 0; i < updatedTransactions.length; i++) {
                transactionCategories[group.category] = i;
                updatedTransactions[i].amount = Number.parseFloat(updatedTransactions[i].amount)
            }
        }

        for (let transaction of data) {
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
        console.log(updatedTransactions)
        setTransactions(updatedTransactions)
    }


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
        <button onClick={() => open()} disabled={!ready}>
            <strong>Link account</strong>
        </button>
    </div>
  );
}

export default PlaidButton;