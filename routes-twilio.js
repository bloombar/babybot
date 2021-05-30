const http = require("http")
const fs = require("fs")
const express = require("express")
const router = express.Router()
//const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)
const { respondToMessage } = require("./twilio-helpers")

// list of recipients
const recipients = [
  // make the messages a bit more personalized to each recipient for better effect
  // follow this format:
  // {name:"Foo Barstein", phone:"+12128881212", message:`This is the ${process.env.BABY_NAME} Babybot.  I can answer any questions you might have on behalf of the tired parents of this beautiful new baby ${process.env.BABY_BOYGIRL}.`},
  // {name:"Bar Foostein", phone:"‭‭‭+19148826758", message:`This is the ${process.env.BABY_NAME} Babybot.  I can answer any questions you might have on behalf of the tired parents of this beautiful new baby ${process.env.BABY_BOYGIRL}.`},
]

router.post("/sms", (req, res) => {
  // parse message
  const from = req.body.From
  const body = req.body.Body
  console.log(`Incoming message from ${from}: ${body}`)

  // log to file
  const filename = "logs/" + from.replace("+", "") + ".txt"
  fs.appendFile(filename, body + "\n", err => {
    // throws an error, you could also catch it here
    if (err) throw err
  })

  // get response from watson
  respondToMessage(from, body).then(responseObj => {
    const response = responseObj.response
    const intent = responseObj.intent

    // add a random pause between 1 and 5 seconds
    const pause = Math.random() * 3000 + 500
    setTimeout(() => {
      // set up basic response
      let twilioObj = {
        body: response,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: from,
      }

      //add photo if desired
      if (intent == "photo") twilioObj.mediaUrl = [process.env.BABY_PHOTO_URL]
      //console.log(JSON.stringify(twilioObj, null, 2));

      client.messages.create(twilioObj).then(message => {
        //console.log(message.sid)
        // log to file
        const filename = "logs/" + twilioObj.to.replace("+", "") + ".txt"
        fs.appendFile(filename, "babybot: " + twilioObj.body + "\n", err => {
          // throws an error, you could also catch it here
          if (err) throw err
        })
      })
    }, pause)
  })
})

router.get("/kickoff", (req, res) => {
  // loop through each recipient
  recipients.map(recipient => {
    // send them a message
    client.messages
      .create({
        body: recipient.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient.phone,
      })
      .then(message => {
        if (message.errorCode) {
          // error!
          console.log("- TWILIO ERROR --")
          console.log("ERROR " + message.errorCode + ": " + error.errorMessage)
        } else {
          // success!
          // console.log('- TWILIO SUCCESS --');
          // console.log("SUCCESS STATUS: " + message.status)

          // log to file
          const filename = "logs/" + recipient.phone.replace("+", "") + ".txt"
          fs.appendFile(
            filename,
            recipient.name.toUpperCase() +
              "\n" +
              "babybot: " +
              recipient.message +
              "\n",
            err => {
              // throws an error, you could also catch it here
              if (err) throw err
            }
          )
        }
        //console.log(JSON.stringify(message, null, 2))
      })
  }) // end loop

  // confirm send
  res.send("Sent!")
})

//export this router to use in app.js
module.exports = router
