module.exports = {
    registerRoutes: function(app) {
        app.get("/", this.home);
        app.post("https://demo.twilio.com/welcome/voice/", this.receiveMessage);
    },
    
    home: function(req, res) {
        res.send("welcome home");
    },
    
    receiveMessage: function(req, res) {
        console.log("thanks for texting us");
    }
}