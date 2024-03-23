import { useOutletContext } from "react-router-dom"
import PlaidLink from "./PlaidLink"
import { QuickstartProvider } from "../../context/PlaidContext"

function Plaid() {
    const {transactions, setTransactions} = useOutletContext();

    return (
        <QuickstartProvider>
            <PlaidLink transactions={transactions} setTransactions={setTransactions} />
        </QuickstartProvider>
    )
}

export default Plaid