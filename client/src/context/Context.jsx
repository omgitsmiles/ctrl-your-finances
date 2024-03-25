import { useContext, createContext, useEffect, useState } from "react";
import { 
    GoogleAuthProvider, 
    signInWithRedirect, 
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const [userWithId, setUserWithId] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        // signInWithPopup(auth, provider);
        signInWithRedirect(auth, provider);
    }

    const createUserWithEmail = async (name, email, password) => {
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: name
            })
        
        } catch (error) {
            console.log(error);
        }
    }

    const signInWithEmail = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    
    //// STATE FOR USER ACCOUNTS, HOUSEHOLD MEMBERS, AND TRANSACTIONS ////
    
    const [bankAccounts, setBankAccounts] = useState([]);
    const [houseMembers, setHouseMembers] = useState([]);
    const [household, setHousehold] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    
    useEffect(() => {
        // retrieve user ID from database
        if (user && (user !== undefined)) {
            const body = {
                name: user.displayName,
                email: user.email,
            }
            fetch(`http://127.0.0.1:5555/api/user`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: `email=${body.email}&name=${body.name}`
            })
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                    .then((userWithId) => setUserId(userWithId))
                } else {
                    resp.json()
                    .then(message => setError(message.error))
                }
            })
        }
    }, [user])
    
    useEffect(() => {
        // retrieve user accounts info
        if (user) {
            fetch(`http://127.0.0.1:5555/api/accounts/${userId.id}`)
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                    .then(accounts => setBankAccounts(accounts))
                } else {
                    resp.json()
                    .then(message => setError(message.error))
                }
            })
        
            // retrieve household member info
            fetch(`http://127.0.0.1:5555/api/household/${userId.id}`)
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                    .then(houseData => {
                    setHouseMembers(houseData['members'])
                    setHousehold(houseData['household'])
                    })
                } else {
                    resp.json()
                    .then(message => setError(message.error))
                }
            })
        
            // retrieve transactions
            fetch(`http://127.0.0.1:5555/api/transactions/${userId.id}`)
            .then(resp => {
                if (resp.ok) {
                    resp.json()
                    .then(data => setTransactions(data))
                } else {
                    resp.json()
                    .then(message => setError(message.error))
                }
            })
        }
    }, [])


    const context = {
        googleSignIn,
        logOut,
        user,
        createUserWithEmail,
        signInWithEmail,
        bankAccounts,
        setBankAccounts,
        houseMembers,
        setHouseMembers,
        transactions,
        setTransactions,
        userId,
        error,
        setError,
    }


    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    )
}

export const AppContext = () => {
    return useContext(Context);
}