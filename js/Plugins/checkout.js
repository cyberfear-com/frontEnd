// A reference to Stripe.js initialized with a fake API key.
const stripe = window.stripe;

// The items the customer wants to buy

//const items = [ window.stripePay ]
let elements=window.elements;


document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret


async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error,paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "https://cyber.com/index.html"
        },
        redirect: "if_required"

    });

    try{
        if (paymentIntent.status === "succeeded") {
            console.log('paid');
            showMessage('Payment was accepted. Please wait to be redirected');
        }
    }catch(error){

    }

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
   // console.log(error);
    try{
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occured.");
    }
        }catch(error){

    }
    setLoading(false);
}

// Fetches the payment intent status after payment submission

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageText.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}
