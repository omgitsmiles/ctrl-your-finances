import Account from "../components/Account/Account";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage/FrontPage";
import ErrorPage from "../components/ErrorPage"; 
import Login from "../components/FrontPage/Login";
import SignUp from "../components/FrontPage/SignUp";
import EmailLink from "../components/EmailLink";
import Protected from "../components/Protected";
import App from "../App";
import Plaid from "../components/Plaid/Plaid";

export const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <FrontPage />,
                
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/email-link",
                element: <EmailLink />,
            },
            {
                path: "/account",
                element: <Protected><Account /></Protected>,
            },
            {
                path: "/budgeting",
                element: <Protected><Budgeting /></Protected>,
            },
            {
                path: "/dashboard",
                element: <Protected><Dashboard /></Protected>,
            },
            {
                path: "/finances",
                element: <Protected><Finances /></Protected>,
            },
            {
                path: "/link",
                element: <Protected><Plaid /></Protected>,

            }
        ]
    }
]