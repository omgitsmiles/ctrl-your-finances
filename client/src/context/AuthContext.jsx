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

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

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

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user, createUserWithEmail, signInWithEmail }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}