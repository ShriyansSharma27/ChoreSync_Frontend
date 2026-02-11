    import { useUser } from "@clerk/clerk-react";
    import { useEffect } from "react";
    import axios from "axios";

    // Custom hook to separately store the customer and provider in the PostgreSQL database
    export const useSyncUser = () => {
        const {user, isLoaded} = useUser();

        useEffect(() => {
            const sync = async () => {
                // Differentiate between Provider and Customer signup
                const finalEndpoint = `${process.env.REACT_APP_API_URL}/auth/customer/signup`;
                if(isLoaded && user) {
                    try {
                        // Insert user details into the corresponding table
                        await axios.post(finalEndpoint, {
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
        }, [isLoaded, user]);
    };