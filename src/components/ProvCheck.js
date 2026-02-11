import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProtectedProvider = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [isProvider, setIsProvider] = useState(null);
    const hasRequested = useRef(false);
    const navigate = useNavigate(); 

    async function RoleUpgrade() {
        try {
            const token = await getToken();

            // Insert user details into the provider's table
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/upgrade-role`, {
                'email': user.primaryEmailAddress.emailAddress,
                'first_name': user.firstName,
                'last_name': user.lastName
            }, {
                headers:{
                Authorization: `Bearer ${token}`
                }
            });
            navigate("/panel", { replace: true });
        }
        catch (err) {
            console.log('Error signing up user: ', err);
        }
    }


    useEffect(() => {
        const checkDB = async () => {
            if (!isLoaded || !isSignedIn || !user) return;
            if (hasRequested.current) return;

            hasRequested.current = true;

            try {
                const token = await getToken();
                const email = user.primaryEmailAddress.emailAddress;

                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/auth/isprovider`,
                    {
                        params: { email },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsProvider(res.data.isProvider);
            } catch (err) {
                setIsProvider(false);
            } 
        };

        checkDB();
    }, [isLoaded, isSignedIn, user, getToken]);

    if (!isLoaded) {
        return <div className="text-center mt-5">Loading Authentication...</div>;
    }

    if (!isSignedIn) {
        navigate('/provider', {replace: true});
        return null;
    }

    // Wait for Database check to finish (prevents the button from flashing)
    if (isProvider === null) {
        return <div className="text-center mt-5">Verifying Provider Status...</div>;
    }

    // Not a provider then redirect
    if (!isProvider) {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100%",
                    backgroundColor: "#d3d3d3", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <button
                    onClick={RoleUpgrade}
                    style={{
                        backgroundColor: "#000", 
                        color: "#fff",       
                        padding: "15px 30px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                >
                    Become a Provider
                </button>
            </div>
        );
    }

    return children;


};
