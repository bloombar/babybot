# Babybot

An SMS chatbot that can be used to announce the birth of a baby, and answer common questions on behalf of tired parents, including on such topics as:

- the baby's name and sex
- eye color, hair color, and so on
- birth weight and how the delivery went
- how the mother is feeling
- whether the parents need anything
- whether there are any photos to share (it can send photos)

## Implementation

Babybot is built with Node.js and Express, and relies on [Twilio](https://twilio.com) for sending/receiving text messaging, and [IBM Watson Assistant](https://www.ibm.com/cloud/watson-assistant) for conversation.

## Set up

Basic Node.js/Express web app setup

1. Install dependencies with `npm install`.
1. In the file named `routes-twilio.js`, add the phone numbers of your contacts to the variable named `recipients` - these people will receive the initial text message from your bot announcing your newborn baby.
1. Create a public URL pointing to your app by installing [ngrok](https://ngrok.com) and running the command `ngrok http 3000` (or whichever port your app will runing on). This will output a public URL.

Set up Twilio:

1. Create an account with Twilio and add a phone number that can send and receive SMS and MMS messages.
1. Set up your Twilio phone number to post a webhook with each incoming SMS to the URL, `https://your-ngrok-url.io/api/twilio/sms`, where `your-ngrok-url.io` is replaced with the URL displayed by ngrok.

Set up IBM Watson Assistant:

1. Create an account with [IBM Cloud](https://cloud.ibm.com), and add a Watson Assistant resource service.
1. Launch Watson Assistant and create an Assistant instance. Create a Dialog for the assistant, and set up Intents, Entities, and Dialogs - see [this tutorial](https://www.ibm.com/cloud/architecture/tutorials/watson_conversation_support/) or others for examples on how to set up a basic Assistant dialog. The more Intents, Entities, and Dialog options you give the bot, the more interesting the conversations will be.
1. If you create an intent named `photo`, the bot will attach a photo of the baby to any message that Watson identifies as matching this intent.

Complete app setup:

1. Copy the file named `.env-example` to a file named `.env`, and replace the values with your own after you complete the other setup steps.
1. Run the app locally with `npm start`.
1. Try it out - send an SMS to your Twilio phone number to start a conversation.

Send the announcements to your contacts:

1. Once your bot is capable of holding a minimally-acceptable conversation about the baby, make the birth announcement to the world by running, `https://your-ngrok-url.io/api/twilio/kickoff`, where `your-ngrok-url.io` is replaced with the URL displayed by ngrok. This will shoot out the initial announcement message to the contacts in the `recipients` variable.
1. Watch the entertaining conversations unfold between your contacts and your bot in the log files that will appear within the `logs` directory.

Let us know how it goes!
