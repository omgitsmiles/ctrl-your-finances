import { useContext, createContext, useEffect, useState } from "react";
import { 
    GoogleAuthProvider, 
    signInWithRedirect, 
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink
} from "firebase/auth";
import { auth } from "../firebase";

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log('User:', user)
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        // signInWithRedirect(auth, provider);
    }

    const createUserWithEmail = async (name, email, password, callback) => {
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: name
            })
            setUser(auth.currentUser)
            callback(null, user)
        } catch (error) {
            console.log("Firebase error:", error);
            callback(error, null)
        }
    }

    const signInWithEmail = async (email, password, callback) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            callback(null)
        } catch (error) {
            console.log("Firebase error:", error);
            callback(error)
        }
    }

    // email sign up link
    //  TODO figure out how to remove api key from url
    const actionCodeSettings = {
        url: 'http://127.0.0.1:5173/email-link?apiKey=AIzaSyA8qMrHZyJVActzD0qhPme5mGGyxHFIT6w&oobCode=tRwv3QUFXkqxikY3Ao8fcu4liXZjHvwUpMLRGhrFxVUAAAGOeFx89Q&mode=signIn&lang=en',
        handleCodeInApp: true,
    }

    const signInWithLink = async (email) => {
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error code:', errorCode)
            console.log('Error message:', errorMessage)
        })
    }

    const isSignInLink = async (displayName) => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn')
            if (!email) {
                email = window.prompt('Please provide your email for confirmation')
            }
            signInWithEmailLink(auth, email, window.location.href)
            updateProfile(auth.currentUser, {
                displayName: displayName
            })
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn')
                console.log('Result:', result)
            })
            .catch((error) => {
                console.log('Error:', error)
            })
        }
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
    const [error, setError] = useState('');
    
    
    //// CHANGE THIS WHEN USER SESSION COOKIES ESTABLISHED /////
    const userID = 1
    
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
        signInWithLink,
        isSignInLink,
        bankAccounts,
        setBankAccounts,
        houseMembers,
        setHouseMembers,
        transactions,
        setTransactions,
        error,
        setError,
        isSignInLink
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