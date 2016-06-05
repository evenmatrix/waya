'use strict';
const Hapi = require('hapi');
const Good = require('good');
require('dotenv').config();
// create a server with a host and port
let server = new Hapi.Server();

// add server’s connection information
server.connection({
  host: '0.0.0.0',
  port: Number(process.env.PORT)
});

const goodOptions= {
  ops: {
    interval: 10000
  },
  reporters: {
    console: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [ { log: '*', response: '*', request: '*' } ]
      },
      {
        module: 'good-console'
      },
      'stdout'
    ]
  }
};

// register plugins to server instance
server.register([
  {
    register: Good,
    options: goodOptions
  },
  {
  register: require('./basic-routes')
  }
],(err)=>{
// start your server
  if (err) {
        return console.error(err);
    }
    server.start(() => {
        server.log("info",`Server started at ${ server.info.uri }`);
    });
})

module.exports = server;
