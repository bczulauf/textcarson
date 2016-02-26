var express = require("express");
var twilio = require("twilio");
var routes = require("./routes");
var app = express();
var port = process.env.PORT || 8081;
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio Credentials 
var accountSid = 'AC3af43c1852f84fb508a5df4ceb47018e'; 
var authToken = '34f6b118f22d36524c1c028f2a6574c8'; 
 
//require the Twilio module and create a REST client 
var client = twilio(accountSid, authToken); 
 
client.messages.create({ 
	to: "+12066696351", 
	from: "+15005550006", 
	body: "Welcome to ",   
}, function(err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log(message);   
    } 
});

client.messages.create({ 
	to: "+12064881633", 
	from: "+15005550006", 
	body: "Welcome to ",   
}, function(err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log(message);   
    } 
});

routes.registerRoutes(app);

app.listen(port, function() {
    console.log("app listening on port: " + port)
});