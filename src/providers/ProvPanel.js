import styles_page from '../styles/Page.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser, SignedIn, UserButton, useAuth } from '@clerk/clerk-react';

export default function ProvPanel() {
    const {user, isLoaded} = useUser();

    const [service, setService] = useState('');
    const [img, setImg] = useState('');
    const [details,setDetails] = useState('');
    const [price, setPrice] = useState(0);

    const [provServices, setProvServices] = useState([]);
    const [delService, setDelService] = useState('');

    const [msgDel, setmsgDel] = useState('');
    const [msgAdd, setmsgAdd] = useState('');

    const { getToken } = useAuth();

    async function addService() {
        try {
            const token = await getToken();
            const imgRegex = /\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/i;
            const isImgValid = imgRegex.test(img);

            if(img.length === 0 || service.length === 0 || details.length === 0 || price === 0) {
                setmsgAdd('Please fill out all the required details correctly');

                setTimeout(() => {
                    setmsgAdd('');
                }, 4000);
                return;
            }
            else if(!isImgValid) {
                setmsgAdd('The image url must be one of the following types: webp, png, jpg, jpeg, svg, gif, avif');

                setTimeout(() => {
                    setmsgAdd('');
                }, 4000);
                return;
            }

            const resp = await axios.post(`${process.env.REACT_APP_API_URL}/api/provider/add_service`, {
                'email': user.primaryEmailAddress.emailAddress,
                'service': service,
                'details': details,
                'price': price ,
                'img_url': img
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(resp.data.message === 'existential conflict') {
                setmsgAdd('Service with this name already exists...');

                setTimeout(() => {
                    setmsgAdd('');
                }, 4000);
                return;
            }

            setService('');
            setDetails('');
            setPrice(0);
            setImg('');

            setmsgAdd('Service sucessfully added...');


            setTimeout(() => {
                setmsgAdd('');
            }, 4000);
        }
        catch(err) {
            console.log("Incomplete request: ", err);
        }
    }

    async function deleteService(e) {
        try {
            const token = await getToken();

            if(delService.length === 0) {
                setmsgDel('Please select a service');

                setTimeout(() => {
                    setmsgDel('');
                }, 4000);
                return;
            }

            let resp = await axios.delete(`${process.env.REACT_APP_API_URL}/api/provider/remove_service`, { 
                params: {
                    'email': user.primaryEmailAddress.emailAddress,
                    'service_name': delService,
                }, 
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            });
            resp = resp.data.message;
            if(resp === 'order exists') {
                setDelService('');
                setmsgDel('A customer has an existing order of this service');

                setTimeout(() => {
                    setmsgDel('');
                }, 4000);

                return;
            }
            else {
                setDelService('');
                setmsgDel('Service succesfully deleted!');

                setTimeout(() => {
                    setmsgDel('');
                }, 4000);
            }
        }
        catch(err) {
            console.log("Unable to delete selected service: ", err);
        }
    } 
    
    useEffect(() => {
        const renderProvServices = async () => {
            const token = await getToken();

            let services = await axios.get(`${process.env.REACT_APP_API_URL}/api/provider/provider_services`, {
                params: {
                    'email': user.primaryEmailAddress.emailAddress
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            services = services.data.data;
            setProvServices(services);
        }
        setTimeout(() => {
            renderProvServices();
        }, 1000);
    }, [user, isLoaded, delService, getToken])

    return (
        <div className={styles_page.page_background}>
                <nav className="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
                    <div className="container-fluid">
                        <div className="navbar-text mx-auto">
                            Provider Panel
                        </div>
                        <div className="navbar-text">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </nav>

                <div className='d-flex justify-content-center fw-bold mt-3'>
                    Welcome {user.primaryEmailAddress.emailAddress}!
                </div>

                <div className='container mt-4' style={{paddingTop: '2rem'}}>
                    <div className='row'>
                        <div className='col-12 col-md-8 col-lg-6 mb-4'>
                            {/* Wrapped in a Card container */}
                            <div className="card shadow-sm border-dark">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Add New Service</h5>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Image
                                        </label>
                                        <input
                                        type="text"
                                        placeholder="Paste an image link from Google..."
                                        className="form-control"
                                        onChange={(e) => setImg(e.target.value)}
                                        value={img}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Service name
                                        </label>
                                        <textarea
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setService(e.target.value)}
                                        value={service}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Details
                                        </label>
                                        <textarea
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setDetails(e.target.value)}
                                        value={details}
                                        />
                                    </div>

                                    <div className="mb-3" >
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Price
                                        </label>
                                        <input
                                        type="number"
                                        className="form-control"
                                        onChange={(e) => setPrice(e.target.value)}
                                        value={price}
                                        />
                                    </div>

                                    <button className="btn btn-outline-secondary w-100" type="button" onClick={(e) => addService(e)}>
                                        Add Service
                                    </button>

                                    <div style={{ minHeight: '60px' }}>                
                                        {msgAdd !== '' && (
                                            <div className={`alert ${msgDel.includes('existing order') ? 'alert-danger' : 'alert-success'} py-2 shadow-sm border-dark animate__animated animate__fadeIn mt-4`}>
                                                {msgAdd}
                                            </div>
                                        )}                 
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='col-12 col-md-8 col-lg-6'>
                            {/* Wrapped in a Card container */}
                            <div className="card shadow-sm border-dark">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Manage Services</h5>
                                    <select 
                                    className="form-select border-dark mb-4" 
                                    value={delService}
                                    id="serviceCategory"
                                    onChange={(e) => setDelService(e.target.value)}
                                    >
                                    <option value="" disabled selected>Select service...</option>
                                    {provServices.map((provServ, index) => (
                                        <option key={index} value={provServ.service_name}>
                                        {provServ.service_name}
                                        </option>
                                    ))}
                                    </select>

                                    <button className="btn btn-outline-danger w-100" type="button" onClick={(e) => deleteService(e)}>
                                        Delete Service
                                    </button>

                                    <div style={{ minHeight: '60px' }}>                
                                        {msgDel !== '' && (
                                            <div className={`alert ${msgDel.includes('existing order') ? 'alert-danger' : 'alert-success'} py-2 shadow-sm border-dark animate__animated animate__fadeIn mt-4`}>
                                                {msgDel}
                                            </div>
                                        )}                 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}