import { useSignIn } from "@clerk/clerk-react";
import Nav from "../components/Nav";
import styles_page from '../styles/Page.module.css';

const DemoLoginButton = () => {
    const { signIn, setActive, isLoaded } = useSignIn();

    const handleDemoCustomerLogin = async () => {
        if (!isLoaded) return;
        try {
            const result = await signIn.create({
                identifier: "aryanmetha109@gmail.com",
                password: "Sanupa@5477",
            });
            console.log(result);
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                window.location.href = "/";
            }
        } catch (err) {
            console.error("Demo login failed", err);
        }
    };

    const handleDemoProviderLogin = async() => {
        if (!isLoaded) return;
        try {
            const result = await signIn.create({
                identifier: "jessicaskyline131@gmail.com",
                password: "Sanupa@5477",
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                window.location.href = "/panel";
            }
        } catch (err) {
            console.error("Demo login failed", err);
        }
    };

    return (
        <div className={styles_page.page_background}>
            <Nav />
            
            <div className="d-flex justify-content-center w-100 gap-3">
                <button 
                    onClick={handleDemoCustomerLogin}
                    className="btn btn-dark shadow-sm fw-bold px-4 py-2"
                    style={{ 
                        backgroundColor: '#000000', 
                        color: '#ffffff',
                        border: '1px solid #ffffff',
                        fontSize: '14px',
                        borderRadius: '8px'
                    }}
                >
                    Customer Demo Login
                </button>

                <button 
                    onClick={handleDemoProviderLogin}
                    className="btn btn-dark shadow-sm fw-bold px-4 py-2"
                    style={{ 
                        backgroundColor: '#000000', 
                        color: '#ffffff',
                        border: '1px solid #ffffff',
                        fontSize: '14px',
                        borderRadius: '8px'
                    }}
                >
                    Provider Demo Login
                </button>
            </div>
        </div>
    );
};

export default DemoLoginButton;