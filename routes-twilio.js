const http = require('http');
const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const { respondToMessage } = require('./twilio-helpers');

router.post('/sms', (req, res) => {
    // parse message
    const from = req.body.From;
    const body = req.body.Body
    console.log(`Incoming message from ${from}: ${body}`);

    // get response from watson
    respondToMessage(from, body).then((response) =>{

        // add a random pause between 1 and 5 seconds
        const pause = Math.random() * 5000 + 1000;
        setTimeout(() => {
            // send response via twilio
            const twiml = new MessagingResponse();
            twiml.message(response);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        }, pause);

    });

  });


  router.get('/kickoff', (req, res) => {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // try twilio send message
    client.messages
    .create({
        body: "Hey Katya, have any baby food for me?!",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: '+19148179062'
    })
    .then(message => {
        if (message.errorCode) {
        // error!
        console.log("ERROR " + message.errorCode + ": " + error.errorMessage);
        }
        else {
        // success!
        console.log("SUCCESS STATUS: " + message.status)
        }
        console.log(JSON.stringify(message, null, 2))
    });

  });

//export this router to use in app.js
module.exports = router;
