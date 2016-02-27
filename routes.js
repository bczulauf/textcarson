var authController = require('./controllers/auth');

module.exports = {
    registerRoutes: function(app) {
        // Registers controller routes.
		authController.registerRoutes(app);
        
        app.get("/", function(req, res) {
            console.log("got here");
            res.redirect("/login");
        });
        
        app.post("https://demo.twilio.com/welcome/voice/", function(req, res) {
            console.log("thanks for texting us");
        });
    }
}