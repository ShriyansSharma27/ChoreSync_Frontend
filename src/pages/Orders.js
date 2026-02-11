import Nav from "../components/Nav";
import SideCart from "./Side_Cart";
import styles from '../styles/Page.module.css';
import { useState, useEffect } from "react";
import styles_order from "../styles/Orders.module.css";
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";

export default function Orders() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [bought, setBought] = useState([]);

    // Re-fetch data whenever the user's authentication state changes
    useEffect(() => {
        // Fetch user-specific purchase history from the database
        async function fetchBought() {
            const token = await getToken();
            try {
                let fetch_services = await axios.post(`${process.env.REACT_APP_API_URL}/api/customer/get_services`, {
                    'email': user.primaryEmailAddress.emailAddress
                }, {
                    headers:{
                    Authorization: `Bearer ${token}`
                    }
                });
                setBought(fetch_services.data.data);
            }
            catch(err) {
                console.error("Error");
            }
        }
        
        if(isLoaded && user) {
            fetchBought(user.primaryEmailAddress.emailAddress);
        }
    }, [isLoaded, user, getToken])

    return (
        <div className={styles.page_background}>
            <Nav />
            <div className="row row-cols-4 px-5 mt-5">
                {/* Conditional rendering for loading, auth, and empty states */}
                {
                    !isLoaded ? (
                        <div className={styles_order.title_style}>Loading..</div>
                    ) :  !user ? (
                        <div className={styles_order.title_style}>Sign in to view orders</div>
                    ) : (
                        <>
                            { (bought.length === 0) ?       
                                <div className={styles_order.title_style}>No orders yet :(</div>
                                : 
                                bought.map((service, index) => (
                                    <div className="mb-4" key={index
                                        
                                    }>
                                        <div className="card border-dark">
                                            <img src={service.image_url || "https://rb.gy/f9yl67"} className="card-img-top border-bottom border-dark" alt={service.service_name || "Service image"}/>
                                            <div className="card-body">
                                                <h5 className="card-title">{service.service_name} </h5>
                                                <p className="card-text">{service.service_details} </p>
                                                <p className="card-text fw-bold"> ${service.service_price} </p>
                                                <p className="card-text">Date: {new Date(service.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })} </p>
                                                <p className="card-text">Time: {new Date(service.time).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' })} </p>
                                            </div>
                                        </div>
                                    </div>
                                ))                             
                            }
                        </>
                    )
                }
            </div >

            <SideCart />
        </div >
    )
}