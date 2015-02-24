(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("fs")) : typeof define === "function" && define.amd ? define(["fs"], factory) : global.certy = factory(global.fs);
})(this, function (fs) {
  "use strict";

  var ssl__commands = {
    list: function (input, output) {
      return {
        ca: "openssl req -new -x509 -days 9999 -config " + input + "/ca.cnf -keyout " + output + "/ca-key.pem -out " + output + "/ca-crt.pem",

        serverKey: "openssl genrsa -out " + output + "/server-key.pem 4096",

        serverCSR: "openssl req -new -config " + input + "/ca.cnf -key " + output + "/server-key.pem -out " + output + "/server-csr.pem",

        serverSign: "openssl x509 -req -extfile " + input + "/ca.cnf -days 999 -passin \"pass:password\" -in " + output + "/server-csr.pem -CA " + output + "/ca-crt.pem -CAkey " + output + "/ca-key.pem -CAcreateserial -out " + output + "/server-crt.pem",

        clientKey: "openssl genrsa -out " + output + "/client-key.pem 4096",

        clientCSR: "openssl req -new -config " + input + "/client.cnf -key " + output + "/client-key.pem -out " + output + "/client-csr.pem",

        clientSign: "openssl x509 -req -extfile " + input + "/client.cnf -days 999 -passin \"pass:password\" -in " + output + "/client-csr.pem -CA " + output + "/ca-crt.pem -CAkey " + output + "/ca-key.pem -CAcreateserial -out " + output + "/client-crt.pem"
      };
    } };

  var ssl = ssl__commands;

  var exec = require("child_process").exec;
  var certy = {
    create: function create(cb) {
      var path = __dirname;
      var output = "";
      var input = "";
      if (path.indexOf("/src", path.length - 4) > 0) {
        output = path.replace("/src", "/output");
        input = path.replace("/src", "/input");
      } else {
        output = path.replace("/dist", "/output");
        input = path.replace("/dist", "/input");
      }

      var commands = ssl.list(input, output);

      // Create our certificate authority
      exec(commands.ca, function () {
        // Create server private key
        exec(commands.serverKey, function () {
          // Create a CSR
          exec(commands.serverCSR, function () {
            // Sing the request
            exec(commands.serverSign, function () {
              // create client private key
              exec(commands.clientKey, function () {
                // create the CSR
                exec(commands.clientCSR, function () {
                  // sign the request...using the same CA
                  exec(commands.clientSign, function () {
                    var certs = {
                      serverKey: fs.readFileSync("" + output + "/server-key.pem"),
                      serverCert: fs.readFileSync("" + output + "/server-crt.pem"),
                      clientCert: fs.readFileSync("" + output + "/client-crt.pem"),
                      clientKey: fs.readFileSync("" + output + "/client-key.pem"),
                      ca: fs.readFileSync("" + output + "/ca-crt.pem")
                    };
                    cb(null, certs);

                    return;
                  });
                });
              });
            });
          });
        });
      });
      return;
    }
  };

  var index = certy;

  return index;
});
//# sourceMappingURL=./library-dist.js.map