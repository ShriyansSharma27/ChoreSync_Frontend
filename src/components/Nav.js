import { ImCart } from "react-icons/im";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import logo from '../assets/logoFinal.png';

// Main Navigation Bar with Bootstrap dark theme
function Nav() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    {/* Brand Logo and Name */}
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img 
                            src={logo} 
                            alt="ChoreSync Logo" 
                            width="40" 
                            height="40" 
                            className="d-inline-block align-top me-2" 
                        />
                        <span className="fw-bold">ChoreSync</span>
                    </a>

                    {/* Mobile Menu Toggler */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarText"
                        aria-controls="navbarText"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {/* Internal Page Links */}
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="/">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/cart">
                                    Cart
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/orders">
                                    Orders
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/panel">
                                    Switch to provider
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/faq">
                                    FAQ
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/demo">
                                    Demo login
                                </a>
                            </li>
                        </ul>
                        
                        {/* Cart Toggle and Clerk Auth Buttons */}
                        <div className="navbar-nav align-items-center d-flex gap-3">
                            <button 
                                className="btn nav-link p-0 border-0 shadow-none" 
                                type="button" 
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#offcanvasExample"
                                aria-label="Open Cart"
                            >
                                <ImCart size={20} />
                            </button>

                            <SignedOut>
                                <div className="d-flex gap-2">
                                    <SignInButton mode="modal">
                                        <button className="btn btn-outline-light btn-sm">Login</button>
                                    </SignInButton>
                                </div>
                            </SignedOut>

                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </nav>

        </>

    );
}

export default Nav;