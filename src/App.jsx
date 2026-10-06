import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import CustomerReservation from './pages/CustomerReservation';
import CustomerFoods from './pages/CustomerFoods';
import CafeDashboard from './pages/CafeDashboard';
import CafeOrders from './pages/CafeOrders';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <div className="flex flex-col min-h-screen">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
              >
                Skip to main content
              </a>
              <Navbar />
              <div id="main-content" className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <CustomerReservation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/foods"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <CustomerFoods />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cafe"
                    element={
                      <ProtectedRoute allowedRole="cafe">
                        <CafeDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cafe/order"
                    element={
                      <ProtectedRoute allowedRole="cafe">
                        <CafeOrders />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <Footer />
            </div>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
