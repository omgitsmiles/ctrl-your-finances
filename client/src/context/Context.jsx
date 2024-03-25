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
    console.log('user',user)

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
            const userWithId = {
                name: currentUser.name,
                email: currentUser.email,
            }
            setUserWithId(userWithId)
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
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    
    //// CHANGE THIS WHEN USER SESSION COOKIES ESTABLISHED /////
    const userID = 1

    
    useEffect(() => {
        console.log('user Id:',userId)
        if (user) {
                const userWithId = () => {
                        const body = {
                            name: user.name,
                            email: user.email,
                        }
                        fetch(`http://127.0.0.1:5555/api/user/`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body)
                        })
                        .then(resp => {
                            if (resp.ok) {
                                resp.json()
                                .then((userId) => {return userId})
                            } else {
                                resp.json()
                                .then(message => setError(message.error))
                            }
                        })
                };
                setUserId(userWithId)
        }
    }, [user])
    
    useEffect(() => {
        // retrieve user accounts info
        fetch(`http://127.0.0.1:5555/api/accounts/${userID}`)
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
        fetch(`http://127.0.0.1:5555/api/household/${userID}`)
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
        fetch(`http://127.0.0.1:5555/api/transactions/${userID}`)
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setTransactions(data))
            } else {
                resp.json()
                .then(message => setError(message.error))
            }
        })
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