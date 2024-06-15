/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.sendMessageToWhatsApp = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const phoneNumber = data.phoneNumber;
        const recipientName = data.recipientName;

        const apiUrl = 'https://graph.facebook.com/v19.0/347848611735147/messages';
        const accessToken = 'your_access_token'; // Replace with your access token
        const postData = {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'template',
            template: {
                name: 'lampstack',
                language: {
                    code: 'en_US',
                    policy: 'deterministic'
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'image',
                                image: {
                                    link: 'https://sandslab.com/whatsappmessaging/WhatsAppPoster.jpg'
                                }
                            }
                        ]
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: recipientName
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();
            console.log('Message sent successfully:', result);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

