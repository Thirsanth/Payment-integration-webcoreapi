import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const PaypalCheckout = () => {
    const paypalRef = useRef();
    const [clientId, setClientId] = useState(null);
    const queryParams = new URLSearchParams(window.location.search);
    const amount = queryParams.get('amount');

    useEffect(() => {
        const fetchClientId = async () => {
            try {
                const res = await axios.get('https://localhost:7201/api/PaymentConfig/paypal-client-id');
                setClientId(res.data.clientId);
            } catch (err) {
                console.error('Error fetching PayPal client ID', err);
            }
        };
        fetchClientId();
    }, []);

    useEffect(() => {
        if (!clientId) return;

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.addEventListener("load", () => {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: amount }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert(`Transaction completed by ${details.payer.name.given_name}`);
                    });
                }
            }).render(paypalRef.current);
        });
        document.body.appendChild(script);
    }, [clientId, amount]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Pay with PayPal</h2>
            <p>Amount: ${amount}</p>
            <div ref={paypalRef} style={{ marginTop: '20px' }}></div>
        </div>
    );
};

export default PaypalCheckout;
