const Joi  = require('joi');
const Boom = require('boom');
const firebase = require("firebase");
const jwt = require('jsonwebtoken');
firebase.initializeApp({
  serviceAccount: {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
  },
  databaseURL: process.env.FIREBASE_DB_URL
});
const baseRoutes = {
  register: (server, options, next)=> {
      // add “hello world” route
      server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
          reply('Hello Future Studio!')
        }
      });

      server.route({
        method: ['get'],
        path: '/firebase_token',
        handler: (request, reply) =>{
          let req = require('request');
          const rawRew = request.raw.req;
          let headers = {
            'Authorization' : request.headers['x-verify-credentials-authorization']
          };

          let options = {
            url: request.headers['x-auth-service-provider'],
            headers: headers
          };
          console.log("options",options);
          // get Twitter / Digits validated information
          req(options, (error, response, body)=>{
            console.log("body",body);
            if (!error && response.statusCode == 200) {
              var digitsData = JSON.parse(body);
              console.log("digitsData: ",digitsData);
              // create FBToken
              let token = firebase.auth().createCustomToken(digitsData.id_str,{phone_number: digitsData.phone_number});
              /**
              let iat = Date.now()/1000;
              let exp = iat + 60*60*24*7;
              let token = jwt.sign({
                iss: process.env.CLIENT_EMAIL,
                sub: process.env.CLIENT_EMAIL,
                aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
                uid: digitsData.id_str ,
                phone_number: digitsData.phone_number,
                iat: iat,
                exp: exp,
                claims:{
                  phone_number: digitsData.phone_number
                }
              },process.env.PRIVATE_KEY, { algorithm: 'RS256'});**/
              let auth = {
                access_token: token,
                uid: digitsData.id_str ,
                phone_number: digitsData.phone_number,
              }
              reply(auth);
            }else{
              reply(Boom.unauthorized('Unauthorized'));
            }
          });
          // process the request’s payload …
    }
  })

    server.route({
        method: 'GET',
        path: '/{yourname*}',
        config: {  // validate will ensure YOURNAME is valid before replying to your request
            validate: { params: { yourname: Joi.string().max(40).min(2).alphanum() } },
            handler: function (req,reply) {
                reply('Hello '+ req.params.yourname + '!');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/photo/{id*}',
        config: {  // validate will ensure `id` is valid before replying to your request
          validate: { params: { id: Joi.string().max(40).min(2).alphanum() } },
          handler: function (req,reply) {
              // until we implement authentication we are simply returning a 401:
              reply(Boom.unauthorized('Please log-in to see that'));
              // the key here is our use of the Boom.unauthorised method
          }
        }
    });

    next();
  }
}

baseRoutes.register.attributes = {
  name: 'base-routes',
  version: '1.0.0'
}

module.exports = baseRoutes
