import Account from "../components/Account";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage";
import ErrorPage from "../components/ErrorPage"; 
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export const routes = [
    {
        path: "/",
        element: <FrontPage />,
        errorElement: <ErrorPage />,
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
]