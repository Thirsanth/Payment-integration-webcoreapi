
// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("pk_test_51RFxzRQsTv1UMeDURHHx9OiKe7iaU9Lfd5MzP3ognYOoYR0MrhH2OOodNpY56J3XxqWYB9nASBkW66FNe0cTHbQQ00BLalBTWg");


// const Checkout = () => {
//     useEffect(() => {
//         const queryParams = new URLSearchParams(window.location.search);
//         const amount = queryParams.get('amount');

//         const fetchStripeSession = async () => {
//             try {
//                 const response = await axios.get(`https://localhost:7201/api/payment/create-stripe-session?amount=${amount}`);
//                 // window.location.href = response.data.sessionUrl;  // Redirect to Stripe checkout

//                 const session = response.data;
            

//     const stripe = await stripePromise;
//     await stripe.redirectToCheckout({ sessionId: session.sessionId });
//             } catch (err) {
//                 console.error('Stripe session creation failed.', err);
//             }
//         };

//         fetchStripeSession();
//     }, []);

//     return <div>Processing checkout...</div>;
// };

// export default Checkout;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("pk_test_51RFxzRQsTv1UMeDURHHx9OiKe7iaU9Lfd5MzP3ognYOoYR0MrhH2OOodNpY56J3XxqWYB9nASBkW66FNe0cTHbQQ00BLalBTWg");

// const Checkout = () => {
//     const [amount, setAmount] = useState(null);
//     const [paypalClientId, setPaypalClientId] = useState(null);
//     const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
//     const [paypalButtonShown, setPaypalButtonShown] = useState(false);

//     useEffect(() => {
//         const queryParams = new URLSearchParams(window.location.search);
//         const amt = queryParams.get('amount');
//         setAmount(amt);

//         axios.get('https://localhost:7201/api/PaymentConfig/paypal-client-id')
//             .then(res => setPaypalClientId(res.data.clientId))
//             .catch(err => console.error('Failed to get PayPal Client ID', err));
//     }, []);

//     const handleStripePayment = async () => {
//         try {
//             const response = await axios.get(`https://localhost:7201/api/payment/create-stripe-session?amount=${amount}`);
//             const stripe = await stripePromise;
//             await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
//         } catch (err) {
//             console.error('Stripe session creation failed.', err);
//         }
//     };

//     const handlePaypalClick = async () => {
//         if (!paypalScriptLoaded) {
//             const script = document.createElement('script');
//             script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
//             script.onload = () => {
//                 setPaypalScriptLoaded(true);
//                 renderPaypalButton();
//             };
//             document.body.appendChild(script);
//         } else {
//             renderPaypalButton();
//         }
//     };

//     const renderPaypalButton = () => {
//         if (paypalButtonShown) return; // Prevent multiple renders
//         setPaypalButtonShown(true);

//         window.paypal.Buttons({
//             createOrder: (data, actions) => {
//                 return actions.order.create({
//                     purchase_units: [{
//                         amount: { value: amount }
//                     }]
//                 });
//             },
//             onApprove: (data, actions) => {
//                 return actions.order.capture().then(details => {
//                     alert(`Transaction completed by ${details.payer.name.given_name}`);
//                     // You can call your backend to finalize the order here
//                 });
//             }
//         }).render('#paypal-button-container');
//     };

//     return (
//         <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
//             <h2>Choose Payment Method</h2>
//             <p>Amount: ₹{amount}</p>

//             <button
//                 onClick={handleStripePayment}
//                 style={{
//                     marginBottom: '1rem',
//                     width: '100%',
//                     padding: '10px',
//                     backgroundColor: '#6772e5',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '5px'
//                 }}
//             >
//                 Pay with Stripe
//             </button>

//             <button
//                 onClick={handlePaypalClick}
//                 style={{
//                     width: '100%',
//                     padding: '10px',
//                     backgroundColor: '#ffc439',
//                     color: '#000',
//                     border: 'none',
//                     borderRadius: '5px',
//                     marginBottom: '1rem'
//                 }}
//             >
//                 Pay with PayPal
//             </button>

//             <div id="paypal-button-container"></div>
//         </div>
//     );
// };

// export default Checkout;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe("pk_test_51RFxzRQsTv1UMeDURHHx9OiKe7iaU9Lfd5MzP3ognYOoYR0MrhH2OOodNpY56J3XxqWYB9nASBkW66FNe0cTHbQQ00BLalBTWg");

const Checkout = () => {
    const [amount, setAmount] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const amt = queryParams.get('amount');
        setAmount(amt);
    }, []);

    const handleStripePayment = async () => {
        try {
            const response = await axios.get(`https://localhost:7201/api/payment/create-stripe-session?amount=${amount}`);
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        } catch (err) {
            console.error('Stripe session creation failed.', err);
        }
    };

    const handlePaypalRedirect = () => {
        navigate(`/paypal-checkout?amount=${amount}`);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
            <h2>Choose Payment Method</h2>
            <p>Amount: ${amount}</p>

            <button
                onClick={handleStripePayment}
                style={{
                    marginBottom: '1rem',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#6772e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Pay with Stripe
            </button>

            <button
                onClick={handlePaypalRedirect}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffc439',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    marginBottom: '1rem'
                }}
            >
                Pay with PayPal
            </button>
        </div>
    );
};

export default Checkout;
