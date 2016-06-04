const Joi  = require('joi');
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
      method: ['GET' ],
      path: '/login',
      handler: function (request, reply) {
        // process the request’s payload …
      reply('A login Path')
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

    next();
  }
}

baseRoutes.register.attributes = {
  name: 'base-routes',
  version: '1.0.0'
}

module.exports = baseRoutes
