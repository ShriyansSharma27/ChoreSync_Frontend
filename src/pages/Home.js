import Nav from '../components/Nav';
import { EmptyServiceCard } from '../components/Cards';
import styles_page from '../styles/Page.module.css';
import { useState, useEffect, createContext, useCallback } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { add } from '../redux/GlobalStates';
import axios from "axios";
import SideCart from './Side_Cart';
import * as bootstrap from 'bootstrap';

export const CartContext = createContext();

export default function Home() {
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);

    const [dates, setDates] = useState({});
    const [times, setTimes] = useState({}); 

    const grab_serv = useSelector((state) => state.cartItems.value);
    const dispatch = useDispatch();

    // To add items to cart 
    function addToCart(idx, e) {
        let add_service = services[idx];
        add_service = {...add_service, "service_date":dates[idx], "service_time":times[idx]};
        const check_selected = grab_serv.find((service) => service.service_id === add_service.service_id);
        const currentDate =  new Date();
        const serviceDate = new Date(add_service.service_date + 'T' + add_service.service_time);
        if (! check_selected && serviceDate > currentDate) {
            dispatch(add(add_service));
            const sideCartElement = document.getElementById('offcanvasExample');
            const inst = bootstrap.Offcanvas.getOrCreateInstance(sideCartElement);
            inst.show();
        }
        else if(serviceDate < currentDate) {
            e.stopPropagation();

            const popover = new bootstrap.Popover(e.currentTarget, {
                content: 'Please select an appropriate date and time',
                placement: 'right',
                trigger: 'manual'
            })

            popover.show();

            setTimeout(() => {
                popover.dispose();
            }, 3000);
        }
        else {
            e.stopPropagation();

            const popover = new bootstrap.Popover(e.currentTarget, {
                content: 'Service has already been added to cart',
                placement: 'right',
                trigger: 'manual'
            })

            popover.show();

            setTimeout(() => {
                popover.dispose();
            }, 3000);
        }
    }

    // To check whether the details are entered properly to add item to cart
    function checkAdd(index, event) {
        const form = event.currentTarget.closest('form');

        if(!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            
            const popover = new bootstrap.Popover(event.currentTarget, {
                content: 'Details are incomplete',
                placement: 'right',
                trigger: 'manual'
            })

            popover.show();

            setTimeout(() => {
                popover.dispose();
            }, 3000);
        }
        else {
            addToCart(index, event);
            form.classList.remove('was-validated');
        }
    }

    const fetchServices = useCallback(async() => {
        try {
            // Fetch all services
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/provider/get_services`);
            const fetch_services = response.data.data;
            console.log(fetch_services);

            for(let i = 0; i < fetch_services.length; i++) {
                const provDetails = await axios.get(`${process.env.REACT_APP_API_URL}/api/provider/${fetch_services[i].provider_id}/get_provider`);
                setProviders(prevProviders => [
                    ...prevProviders, 
                    {
                        first_name: provDetails.data.details.first_name,
                        last_name: provDetails.data.details.last_name
                    }
                ]);
            }

            setServices(fetch_services);
        }
        catch (err) {
            console.error("Error fetching data:", err);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);


    return (
        <div className={styles_page.page_background} >
            <Nav />

                <div className="row row-cols-4 px-5 mt-5">
                    {(services.length === 0) ?
                        Array.from({ length: 8 }).map((_, idx) => (
                            < EmptyServiceCard key={idx}/>
                        ))
                        :
                        services.map((service, index) => (
                            <form key={index} className="needs-validation position-relative" noValidate > 
                                <div className="mb-4">
                                    <div className="card border-dark">
                                        <div className='ratio ratio-4x3'>
                                            <img src={service.image_url || "https://rb.gy/f9yl67"} className="card-img-top border-bottom border-dark" alt={service.service_name || "Service image"}/>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{service.service_name} </h5>
                                            <p className="card-text">{service.service_details} </p>
                                            <p className="card-text"> By {providers[index]?.first_name} {providers[index]?.last_name}</p>
                                            <p className="card-text fw-bold"> ${service.service_price} </p>
                                            <input 
                                                type="date"
                                                className="form-control mb-4" 
                                                onChange={(e) => setDates({ ...dates, [index]: e.target.value })}
                                                required                                    
                                            />
                                            <input 
                                                type="time"
                                                className="form-control mb-4"   
                                                onChange={(e) => setTimes({ ...times, [index]: e.target.value })}    
                                                required                                   
                                            />
                                            <button className="btn btn-outline-secondary" type="button" onClick={(e) => checkAdd(index, e)}>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ))
                    }
            </div>

            <SideCart />
        </div>

    );
}
