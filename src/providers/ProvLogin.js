import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function ProvLogin() {
    const location = useLocation();
    const errorMessage = location.state?.error;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark px-3">
          
          {/* Display the error message only if it exists */}
          {errorMessage && (
            <div 
              className="alert alert-warning border-0 shadow-sm mb-4 text-center w-100" 
              style={{ maxWidth: '400px', fontSize: '14px', borderRadius: '10px' }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorMessage}
            </div>
          )}

          {/* The Clerk SignIn Component */}
          <SignIn 
            signUpUrl="/signup" 
            forceRedirectUrl="/panel"
          />
        </div>
      );
}