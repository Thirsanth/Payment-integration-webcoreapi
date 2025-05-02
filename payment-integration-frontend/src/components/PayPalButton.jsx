import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PayPalButton = ({ amount }) => {
    const [clientId, setClientId] = useState('');

    useEffect(() => {
        const fetchClientId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/paymentconfig/paypal-client-id');
                setClientId(response.data.clientId);

                if (window.paypal) {
                    window.paypal.Buttons({
                        createOrder: (data, actions) => actions.order.create({
                            purchase_units: [{
                                amount: {
                                    currency_code: 'USD',
                                    value: amount
                                }
                            }]
                        }),
                        onApprove: (data, actions) => actions.order.capture().then((details) => {
                            alert('Transaction completed');
                            // Redirect or additional logic
                        }),
                        onError: (err) => {
                            console.error('PayPal Checkout error', err);
                        }
                    }).render('#paypal-button-container');
                }
            } catch (err) {
                console.error('Failed to fetch PayPal client ID', err);
            }
        };

        fetchClientId();
    }, [amount]);

    return <div id="paypal-button-container">{/* PayPal button will be rendered here */}</div>;
};

export default PayPalButton;