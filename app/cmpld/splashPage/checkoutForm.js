import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        window.fetch("/create.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: [{ id: "xl-tshirt" }] })
        }).then(res => {
            return res.json();
        }).then(data => {
            setClientSecret(data.clientSecret);
        });
    }, []);

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (payload.error) {
            setError(`Payment failed ${ payload.error.message }`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return React.createElement(
        "form",
        { id: "payment-form", onSubmit: handleSubmit },
        React.createElement(CardElement, { id: "card-element", options: cardStyle, onChange: handleChange }),
        React.createElement(
            "button",
            {
                disabled: processing || disabled || succeeded,
                id: "submit"
            },
            React.createElement(
                "span",
                { id: "button-text" },
                processing ? React.createElement("div", { className: "spinner", id: "spinner" }) : "Pay now"
            )
        ),
        error && React.createElement(
            "div",
            { className: "card-error", role: "alert" },
            error
        ),
        React.createElement(
            "p",
            { className: succeeded ? "result-message" : "result-message hidden" },
            "Payment succeeded, see the result in your",
            React.createElement(
                "a",
                {
                    href: `https://dashboard.stripe.com/test/payments`
                },
                " ",
                "Stripe dashboard."
            ),
            " Refresh the page to pay again."
        )
    );
}