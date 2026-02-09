import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const ProtectedProvider = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [isProvider, setIsProvider] = useState(null);

    useEffect(() => {
        const checkDB = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    const email = user.primaryEmailAddress.emailAddress;
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/isprovider`, {
                        params: {
                            email: email
                          }
                    });
                    setIsProvider(res.data.isProvider);
                } catch (err) {
                    setIsProvider(false);
                }
            }
        };
        checkDB();
    }, [isLoaded, isSignedIn, user]);

    // Wait for Clerk to load
    if (!isLoaded || (isSignedIn && isProvider === null)) {
        return <div className="vh-100 d-flex justify-content-center align-items-center">Verifying Provider Status...</div>;
    }

    // If not signed into Clerk, send to Login
    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    // If signed in but not a provider in the POSTGRESQL backend, kick to sign in
    if (isProvider === false) {
        return <Navigate to="/provider" replace state={{ error: "Please signup as a provider first" }}/>;
    }

    // Show the ProvPanel if confirmed status
    return children;
};