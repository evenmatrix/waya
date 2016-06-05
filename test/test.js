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
        t.end();// t.end() callback is required to end the test in tape
    });
});

test("Deny view of photo if unauthenticated /photo/{id*} ", function(t) {
    var options = {
        method: "GET",
        url: "/photo/8795"
    };
    // server.inject lets you similate an http request
    server.inject(options, function(response) {
        t.equal(response.statusCode,401);  //  Expect http response status code to be 200 ("Ok")
        t.equal(response.result.message,"Please log-in to see that"); // (Don't hard-code error messages)
        t.end();
    });
});

test("Login with fake credentials should return 401", function(t) {
    var options = {
        method: "POST",
        url: "/login",
        payload:{
          "X-Verify-Credentials-Authorization":"value",
          "X-Auth-Service-Provider":"https://api.digits.com/1.1/sdk/account.json"
        }
    };
    // server.inject lets you similate an http request
    server.inject(options, function(response) {
        t.equal(response.statusCode,401);  //  Expect http response status code to be 200 ("Ok")
        t.equal(response.result.message,"Unauthorized"); // (Don't hard-code error messages)
        server.stop(function(){
              console.log('done');
            });
        t.end();
    });
});
