import OktaAuth from '@okta/okta-auth-js';

class Authorization {
    constructor() {
        var authClient = new OktaAuth({
            // Org URL
            url: 'https://ebsco.okta.com',
            // OpenID Connect APP Client ID
            clientId: '0oab4qpkhz1UR4Jbi0h7',
            // Trusted Origin Redirect URI
            redirectUri: 'http://localhost:3333'
          });
          // Attempt to retrieve ID Token from Token Manager
          var idToken = authClient.tokenManager.get('idToken')
          .then((idToken: any) => {
            // If ID Token exists, output it to the console
            if (idToken) {
              console.log(`hi ${idToken.claims.email}!`);
            // If ID Token isn't found, try to parse it from the current URL
            }
            else if (location.hash) {
              authClient.token.parseFromUrl()
              .then((idToken: any) => {
                console.log(`hi ${idToken.claims.email}!`);
                // Store parsed token in Token Manager
                authClient.tokenManager.add('idToken', idToken);
                console.log(idToken);
              });
            }
            else {
              // You're not logged in, you need a sessionToken
              authClient.token.getWithRedirect({
                responseType: 'id_token'
              });
            }
          });
    }

    
}