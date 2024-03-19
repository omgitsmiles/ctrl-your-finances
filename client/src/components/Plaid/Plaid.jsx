import PlaidLink from "./PlaidLink"
import { QuickstartProvider } from "../../context/Context"

function Plaid() {
    return (
        <QuickstartProvider>
            <PlaidLink />
        </QuickstartProvider>
    )
}

export default Plaid