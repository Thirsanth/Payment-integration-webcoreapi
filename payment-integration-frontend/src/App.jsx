import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BillingInfoForm from './components/BillingInfoForm';
import Products from './components/Products';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import PaypalCheckout from './components/PaypalCheckout';

const App = () => (
    <Router>
        <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/billing-info" element={<BillingInfoForm />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/paypal-checkout" element={<PaypalCheckout />} />
            <Route exact path="/" element={() => <div>Welcome to Payment Integration</div>} />
        </Routes>
    </Router>
);

export default App;