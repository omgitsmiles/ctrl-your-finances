import PlaidLink from "./PlaidLink"
import { QuickstartProvider } from "../../context/PlaidContext"

function Plaid() {
    return (
        <QuickstartProvider>
            <PlaidLink />
        </QuickstartProvider>
    )
}

export default Plaid