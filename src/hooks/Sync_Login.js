import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Custom hook to separately store the customer and provider in the PostgreSQL database
export const useSyncUser = () => {
    const {user, isLoaded} = useUser();
    const location = useLocation();

    useEffect(() => {
        const sync = async () => {
            const checkPath = location.pathname.includes('/provider');
            // Differentiate between Provider and Customer signup
            const finalEndpoint = checkPath ? `${process.env.REACT_APP_API_URL}/auth/provider/signup` : `${process.env.REACT_APP_API_URL}/auth/customer/signup`
            if(isLoaded && user) {
                try {
                    // Insert user details into the corresponding table
                    const resp = await axios.post(finalEndpoint, {
                        'email': user.primaryEmailAddress.emailAddress,
                        'first_name': user.firstName, 
                        'last_name': user.lastName
                    });
                }
                catch(err) {
                    console.log('Error signing up user: ', err);
                }
            }
        };
        sync();
    }, [isLoaded, user, location.pathname]);
};