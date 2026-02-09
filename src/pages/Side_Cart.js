import { useSelector, useDispatch} from 'react-redux';
import { remove } from '../redux/GlobalStates';

export default function SideCart() {
    const grab_serv = useSelector((state) => state.cartItems.value);
    const dispatch = useDispatch();

    function removeFromCart(idx) {
        dispatch(remove(idx));
    }
    
    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Cart</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {grab_serv.length > 0 ?
                        grab_serv.map((selec, index) => (
                            <div className="g-4" key={index}>
                                <div key={index} className="card mb-4 border-dark">
                                    <img src={selec.image_url || "https://rb.gy/f9yl67"} className="card-img-top border-bottom border-dark" alt={"Product"}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{selec.service_name} </h5>
                                        <p className="card-text">{selec.service_details} </p>
                                        <p className="card-text-bold"> ${selec.service_price} </p>
                                        <p className="card-text-bold"> Date:{selec.service_date} </p>
                                        <p className="card-text-bold"> Time:{selec.service_time} </p>
                                        <button className="btn btn-outline-secondary" onClick={() => removeFromCart(index)}>Remove from Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <p>No items in cart</p>
                    }
                </div>
        </div>
        
    );
}