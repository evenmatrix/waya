const Joi  = require('joi');
const Boom = require('boom');
const FirebaseTokenGenerator = require("firebase-token-generator");
const FIRE_BASE_SECRET=process.env.FIRE_BASE_SECRET;

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
          let tokenGenerator = new FirebaseTokenGenerator(FIRE_BASE_SECRET);
          let req = require('request');

          let headers = {
            'Authorization' : request.headers['X-Verify-Credentials-Authorization']
          };

          let options = {
            url: request.headers['X-Auth-Service-Provider'],
            headers: headers
          };
          console.log("options",options);
          // get Twitter / Digits validated information
          req(options, (error, response, body)=>{
            console.log("body",body);
            if (!error && response.statusCode == 200) {
              var digitsData = JSON.parse(body);
              console.log("digitsData: "+data);
              // create FBToken
              let  token  = tokenGenerator.createToken({uid: digitsData.id_str/*, username: 'bla bla' */});
              reply(token)
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
