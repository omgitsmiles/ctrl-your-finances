import Account from "../components/Account/Account";
import App from "../App";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage/FrontPage";
import ErrorPage from "../components/ErrorPage"; 
import Login from "../components/FrontPage/Login";
import SignUp from "../components/FrontPage/SignUp";
import Protected from "../components/Protected";
import Plaid from "../components/Plaid/Plaid";
import SampleChart from "../components/TransactionChart";

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

            },
            {
                path: "/samplechart",
                element: <SampleChart />,
            }
        ]
    }
]