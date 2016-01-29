/*
Load environment variables from .env file
NEXMO_API_KEY={YOUR_API_KEY}
NEXMO_API_SECRET={YOUR_API_KEY}
NEXMO_OUTBOUND_NUMBER={YOUR_OUTBOUND_NUMBER}
*/
require('dotenv').load();

// Setup Express and Socket.IO
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Set up Nexmo client
var nexmo = require('easynexmo');

var nexmoApiKey = process.env.NEXMO_API_KEY;
var nexmoApiSecret = process.env.NEXMO_API_SECRET;
var nexmoOutboundNumber = process.env.NEXMO_OUTBOUND_NUMBER;

nexmo.initialize(nexmoApiKey, nexmoApiSecret, true);

/**
 * Handle POST request from web client requesting
 * to send an SMS
 */
app.post('/sms', function (req, res) {
  var toNumber = req.body.to_number;
  var textMessage = req.body.text;
  
  io.emit('sms:send', {to: toNumber, text: textMessage});
  
  nexmo.sendTextMessage(nexmoOutboundNumber, toNumber, textMessage, null,
    // callback
    function(err, json) {
      var responseText;
      if(err) {
        // Something went wrong with the HTTP request
        console.error(err);
        responseText = err.toString();
        
        io.emit('sms:sending-error', err);
      }
      else {
        // The request was successful.
        // This doesn't mean the SMS was sent.
        // Check the JSON response
        responseText = JSON.stringify(json, null, 2);
        console.log(responseText);
        
        io.emit('sms:sending-success', json);
      }
      res.send(responseText);
    }
  );
});

// Handle incoming WebHooks resulting from inbound SMS messages
app.get('/sms-webhook', function(req, res) {
  console.log('Incoming WebHook:', req.query);
  io.emit('sms:webhook', req.query);
  res.sendStatus(200);
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
