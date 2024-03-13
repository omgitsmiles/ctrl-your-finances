import Account from "../components/Account";
import Budgeting from "../components/Budgeting";
import Dashboard from "../components/Dashboard";
import Finances from "../components/Finances";
import FrontPage from "../components/FrontPage";

export const routes = [
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
]