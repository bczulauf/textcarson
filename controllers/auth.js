var crypto = require('crypto');
var adal = require('adal-node');
var AuthenticationContext = adal.AuthenticationContext;

var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE'];
var sampleParameters

if (!parametersFile) {
  sampleParameters = {
    tenant : 'textcarson.onmicrosoft.com',
    authorityHostUrl : 'https://login.windows.net',
    clientId : '624ac9bd-4c1c-4686-aec8-b56a8991cfb3',
    username : 'frizzo@naturalcauses.com',
    password : ''
  };
}

var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
var redirectUri = 'http://localhost:3000/getAToken';
var resource = '00000002-0000-0000-c000-000000000000';

var templateAuthzUrl = 'https://login.windows.net/' + sampleParameters.tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';

function createAuthorizationUrl(state) {
  var authorizationUrl = templateAuthzUrl.replace('<client_id>', sampleParameters.clientId);
  authorizationUrl = authorizationUrl.replace('<redirect_uri>',redirectUri);
  authorizationUrl = authorizationUrl.replace('<state>', state);
  authorizationUrl = authorizationUrl.replace('<resource>', resource);
  return authorizationUrl;
}

module.exports = {
    registerRoutes: function(app){
        app.get("/getAToken", function(req, res) {
            if (req.cookies.authstate !== req.query.state) {
                res.send('error: state does not match');
            }
            var authenticationContext = new AuthenticationContext(authorityUrl);
            authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, resource, sampleParameters.clientId, sampleParameters.clientSecret, function(err, response) {
                var message = '';
                if (err) {
                message = 'error: ' + err.message + '\n';
                }
                message += 'response: ' + JSON.stringify(response);

                if (err) {
                res.send(message);
                return;
                }

                // Later, if the access token is expired it can be refreshed.
                authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, sampleParameters.clientId, sampleParameters.clientSecret, resource, function(refreshErr, refreshResponse) {
                if (refreshErr) {
                    message += 'refreshError: ' + refreshErr.message + '\n';
                }
                message += 'refreshResponse: ' + JSON.stringify(refreshResponse);

                res.send(message); 
                }); 
            });
        });
        
        // Clients get redirected here in order to create an OAuth authorize url and redirect them to AAD.
        // There they will authenticate and give their consent to allow this app access to
        // some resource they own.
        app.get("/auth", function(req, res) {
            crypto.randomBytes(48, function(ex, buf) {
                var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

                res.cookie('authstate', token);
                var authorizationUrl = createAuthorizationUrl(token);

                res.redirect(authorizationUrl);
            });  
        });
        
        app.get("/login", function(req, res) {
            console.log(req.cookies);

            res.send('\
                <head>\
                <title>FooBar</title>\
                </head>\
                <body>\
                <a href="./auth">Login</a>\
                </body>\
                    '); 
        });
    }
}