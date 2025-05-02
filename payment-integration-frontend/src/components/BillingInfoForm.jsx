import React, { useState } from 'react';
import axios from 'axios';


const BillingInfoForm = () => {
    const [info, setInfo] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '', amount: 0 });
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            ...info,
            orderId: `order-${Date.now()}`,
          };
        try {
            const response = await axios.post('https://localhost:7201/api/payment/billing-info', dataToSend);
            console.log('Billing info saved:', response.data);
            window.location.href = `/checkout?amount=${info.amount}`;

          
        } catch (err) {
            setError('Failed to save billing information. Please try again.');
            console.error('Failed to save billing information.', err);
        }
    };

    const handleChange = (event) => {
        setInfo({
            ...info,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Full Name</label>
                <input name="fullName" value={info.fullName} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone</label>
                <input name="phone" value={info.phone} onChange={handleChange} required />
            </div>
            <div>
                <label>Address</label>
                <input name="address" value={info.address} onChange={handleChange} required />
            </div>
            <div>
                <label>City</label>
                <input name="city" value={info.city} onChange={handleChange} required />
            </div>
            <div>
                <label>State</label>
                <input name="state" value={info.state} onChange={handleChange} required />
            </div>
            <div>
                <label>Pincode</label>
                <input name="pincode" value={info.pincode} onChange={handleChange} required />
            </div>
            <div>
                <label>Amount</label>
                <input name="amount" type="number" value={info.amount} onChange={handleChange} required />
            </div>
            <button type="submit">Proceed to Checkout</button>
        </form>
    );
};

export default BillingInfoForm;