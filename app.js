const dotenv = require('dotenv').config({silent: true});

// web server imports
const express = require('express'); // app server
const { urlencoded } = require('body-parser');
const port = process.env.PORT || 3000;

// IBM Watson integration
const { getAssistant, createSession } = require('./watson-helpers');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// twilio imports
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

console.log('-- APP STARTING UP --');

// instantiate web server
var logs = null;
var app = express();
app.use(urlencoded({ extended: false }));

// load Twilio API routes
app.use('/api/twilio', require('./routes-twilio'));

// instantiate Watson assistant instance
app.assistant = getAssistant();
app.sessions = {}; // associative array to hold unique session ids for each correspondent

module.exports = app;

