import Nav from "../components/Nav";
import styles_page from '../styles/Page.module.css';
import styles_order from "../styles/Orders.module.css";
import SideCart from "./Side_Cart";
import axios from 'axios';
import { useSelector} from 'react-redux';
import { useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import { remove, clear, purchased } from "../redux/GlobalStates";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Cart() {
    const grab_serv = useSelector((state) => state.cartItems.value);
    const dispatch = useDispatch();
    const {user, isLoaded} = useUser();
    const { getToken }  = useAuth();

    console.log(grab_serv);

    // Calculate total cost in dollars for display and checkout
    function calculate() {
        let subTotal = 0;
        for(let i = 0; i < grab_serv.length; i++) {
            subTotal += grab_serv[i].service_price;
        }
        return subTotal;
    }

    // Initialize Stripe session and record the purchase in the database
    async function handleCheckOut() {
        try {
            const token = await getToken();
            if(user && isLoaded) {
                const email_id = user.primaryEmailAddress.emailAddress;
                const checkoutTotal = calculate();
                const resp = await fetch(`${process.env.REACT_APP_API_URL}/checkout-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: checkoutTotal * 100,
                        currency: 'usd'
                    }),
                });

                const data = await resp.json();  

                // Redirect to Stripe checkout URL upon successful session creation
                if(data.url) {
                    await axios.post(`${process.env.REACT_APP_API_URL}/api/customer/purchase`, {
                        email: email_id,
                        services: grab_serv
                    }, {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                        }
                    });

                    dispatch(purchased(true));
                    dispatch(clear());

                    window.location.href = data.url;
                }
                else {
                    console.error("Failed stripe session initiation");
                }
            }
        }
        catch (e) {
            console.error("Failed stripe checkout session: ", e);
        }
    }

    function removeFromCart(idx) {
        dispatch(remove(idx));
    }

    

    return (
        <div className={styles_page.page_background}>
            <Nav />

            <div className="row row-cols-4 px-5 mt-5">
                    {/* Conditionally render empty cart message or mapped service cards */}
                    {(grab_serv.length === 0) ?
                        <div className={styles_order.title_style}>Cart is empty :(</div>
                        :
                        grab_serv.map((service, index) => (
                            <div className="mb-4" key={index}>
                                <div className="card border-dark">
                                    <img src={service.image_url || "https://rb.gy/f9yl67"} className="card-img-top border-bottom border-dark" alt={service.service_name || "Service image"}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{service.service_name} </h5>
                                        <p className="card-text">{service.service_details} </p>
                                        <p className="card-text fw-bold"> ${service.service_price} </p>
                                        <p className="card-text">Date: {service.service_date} </p>
                                        <p className="card-text">Time: {service.service_time} </p>
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => removeFromCart(index)}>
                                        Remove from Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
            </div>
            
            {/* Display the subtotal of the entire order and proceed to checkout using Stripe */}
            <div>
                {grab_serv.length > 0 && (
                    <div className="fixed-bottom p-4 bg-white border-top d-flex justify-content-between align-items-center shadow">
                        <div className="fs-4 fw-bold text-dark">
                            Subtotal: <span className="text-secondary">${calculate()}</span>
                        </div>

                        <div className="d-flex align-items-center">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn btn-dark px-5 py-2">
                                        Login to Checkout
                                    </button>
                                </SignInButton>
                            </SignedOut>

                            <SignedIn>
                                <button className="btn btn-success px-5 py-2 fw-bold" type="button" onClick={handleCheckOut}>
                                    Proceed to Checkout
                                </button>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </div>

            <SideCart />

        </div>
    );
}