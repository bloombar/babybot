const dotenv = require('dotenv').config({silent: true});
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

console.log(process.env.TWILIO_PHONE_NUMBER);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: process.env.TWILIO_PHONE_NUMBER,
     to: '+16468533493'
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
