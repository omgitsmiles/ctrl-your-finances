import Account from "../components/Account/Account";
import App from "../App";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage/FrontPage";
import Plaid from "../components/Plaid/Plaid";

export const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "/",
                element: <FrontPage />,
            },
            {
                path: "/account",
                element: <Account />,
            },
            {
                path: "/budgeting",
                element: <Budgeting />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/finances",
                element: <Finances />,
            },
            {
                path: "/link",
                element: <Plaid />,
            }
        ]
    },
]