// Watson integration
const { getResponse, createSession } = require('./watson-helpers');

// respond to incoming slack messages
async function respondToMessage(from, message) {
  // respond to the messages from users where userId is defined
  // (otherwise we get a feedback loop from the bot's own messages)
  if (from) {

    // load this user's sessionId or create new one
    const app = require('./app');
    if (!(from in app.sessions)) {
      await createSession(from);
    }
    else {
      //console.log('found existing session id ' + app.sessions[from]);
    }

    return new Promise((resolve, reject) => {
        // get Watson's response to this
        getResponse(message, app.assistant, from).then(responseObj => {
            //promise success
            //console.log("-- twilio-helper.js respondToMessage --");
            console.log(`Outgoing message to ${from}: (${responseObj.intent}) ${responseObj.response}`);
            resolve(responseObj);
        }, error => {
            //promise rejection
            console.log(' -- INVALID WATSON RESPONSE -- ')
            console.error(JSON.stringify(error, null, 2));
            reject(error);
        });        
    });

  } // if from

};

module.exports = {
  respondToMessage: respondToMessage,
};