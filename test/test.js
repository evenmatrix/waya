const test   = require('tape');
const server = require("../server.js"); // our index.js from above

test("Basic HTTP Tests - GET /{yourname*}", function(t) { // t
    var options = {
        method: "GET",
        url: "/Timmy"
    };
    // server.inject lets you similate an http request
    server.inject(options, function(response) {
        t.equal(response.statusCode, 200);  //  Expect http response status code to be 200 ("Ok")
        t.equal(response.result.length, 12); // Expect result to be "Hello Timmy!" (12 chars long)
        server.stop(function(){
              console.log('done');
            });
        t.end();// t.end() callback is required to end the test in tape
    });
});
