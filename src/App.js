import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProvPanel from './providers/ProvPanel';
import ProvLogin from './providers/ProvLogin';
import FAQ from './pages/Faq';
import Demo from './pages/Demo';
import { ProtectedProvider } from './components/ProvCheck';
import { ClerkProvider, SignedOut} from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY) {
  console.log("Check:", process.env.REACT_APP_CLERK_PUBLISHABLE_KEY);
  throw new Error("Missing key")
}

function Content() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/provider" element={<ProvLogin />} />
        <Route path="/faq" element={<FAQ /> } />
        <Route path="/demo" element={<Demo /> } />
        <Route 
          path="/panel" 
          element={
            <>
              <ProtectedProvider>
                <ProvPanel />
              </ProtectedProvider>
              <SignedOut>
                <ProvLogin /> 
              </SignedOut>
            </>
          } 
        />
      </Routes>
  );
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
    >
        <Router>
          <Content />
        </Router>
    </ClerkProvider>
  );
}


export default App;
