'use strict' ; 
/**
 * @fileoverview This file supports a sample tshirt store that suggests 
 * a new tshirt on every load and uses Google Pay as a means of payment. 
 */

/**
 * Google Pay API Integration
 */
const tokenizationSpecification = {
    type : 'PAYMENT_GATEWAY',
    parameters : {
        gateway : 'example',
        gatewayMerchantId : 'gatewayMerchantId',
    }
}

const cardPaymentMethod = {
    type : 'CARD',
    tokenizationSpecification : tokenizationSpecification, 
    parameters : {
        allowedCardNetworks : ['VISA', 'MASTERCARD'],
        allowedAuthMethods : ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    }
}

const googlePayConfiguration = {
    apiVersion : 2,
    apiVersionMinor : 0,
    allowedPaymentMethods : [cardPaymentMethod],
}

/**
 * Holds the Google Pay Client used to call the different methods available through the API. 
 * @type {PaymentsClient}
 * @private
 * */
let googlePayClient;

/**
 * Defines and handles the main operations related to the integration of Google Pay.
 * This function is executed when the Google Pay Library script has finished loading. 
 * */
function onGooglePayLoaded(){
googlePayClient = new googlePayClient.google.payments.api.PaymentsClient({
    environment : 'TEST',

});
googlePayClient.isReadyToPay(googlePayConfiguration)
.then(response => {
    if(response.result) {
        createAndAddButton();
     }
     else{
         //The current user cannot pay using GooglePay. Offer another payment method.
     }
})
.catch(error => console.error('isReadyToPay error: ', error));
}

/**
 * Handles the creation of the button to pay with GooglePay.
 * Once created, this button is appended to the DOM, amount section.
 */
function createAndAddButton(){
    const googlePayButton = googlePayClient.createButton({
        onClick : onGooglePayButtonClicked,
    });
    document.getElementById('container').appendChild(googlePayButton);
}

/**
 * Handles the click of the button to pay with google pay. Takes care of defining the payment data 
 * request to be used in order to load the payments methods available to the user.
 */
function onGooglePayButtonClicked(){
    const paymentDataRequest = { ...googlePayConfiguration };
    paymentDataRequest.merchantInfo = {
        merchantId : 'BCR2DN4TXCWYNKIX',
        merchantName : 'Sid'
    };
    paymentDataRequest.transactionInfo = {
        totalPriceStatus : 'FINAL',
        totalPrice : selectedItem.price,
        currencyCode : 'INR',
        countryCode : 'IN'
    };
    googlePayClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => processPaymentData(paymentData))
        .catch(error => console.error('loadPaymentData error : ', error));
    }
function processPaymentData(paymentData){
        fetch(ordersEndpointUrl, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : paymentData
        })
    }