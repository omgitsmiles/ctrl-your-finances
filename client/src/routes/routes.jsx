import Account from "../components/Account";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage/FrontPage";
import ErrorPage from "../components/ErrorPage"; 
import Login from "../components/FrontPage/Login";
import SignUp from "../components/FrontPage/SignUp";
import Protected from "../components/Protected";
import App from "../App";
import Plaid from "../components/Plaid/Plaid";
import PlaidLink from "../components/Plaid/PlaidLink";

export const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <FrontPage />,
                
                children: [
                    {
                        path: "/login",
                        element: <Login />,
                    },
                    {
                        path: "/signup",
                        element: <SignUp />,
                    }]
            },
            {
                path: "/account",
                element: <Protected><Account /></Protected>,
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
    }
]