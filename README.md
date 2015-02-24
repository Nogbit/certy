# Certy
[![Build Status](https://travis-ci.org/Nogbit/certy.svg?branch=master)](https://travis-ci.org/Nogbit/certy)
[![Code Climate](https://codeclimate.com/github/Nogbit/certy/badges/gpa.svg)](https://codeclimate.com/github/Nogbit/certy)
[![Test Coverage](https://codeclimate.com/github/Nogbit/certy/badges/coverage.svg)](https://codeclimate.com/github/Nogbit/certy)
[![Dependency Status](https://david-dm.org/Nogbit/certy.svg)](https://david-dm.org/Nogbit/certy)
[![devDependency Status](https://david-dm.org/Nogbit/certy/dev-status.svg)](https://david-dm.org/Nogbit/certy#info=devDependencies)

Simply generates all the necessary certificates for client and server TLS handshaking.  The end result can be used when you need a mock server that enforces client certification authentication.

### Install

    npm install certy

### Generate Certificates
Require the module and use the return certs object as needed.

    var certy =  require('certy');

    certy.create(function (err, certs) {
      console.log(certs);

      // create a server and make requests
    };

The ``create`` method returns a ``certs`` object that has the following...

* serverKey: The server private key.
* serverCert: The certificate for use by the server application.
* clientCert: The certificate for use by the application caller.
* clientKey: The client private key.
* ca: The certificate authority for the client and server certs.


### Example

    certy.create(function (err, certs) {

      // enable self signed certificates, not ideal for production
      // this module is design to be used in testing environments
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      // server
      var options = {
        key: certs.serverKey,
        cert: certs.serverCert,
        ca: certs.ca,
        requestCert: true,
        rejectUnauthorized: true
      };

      var server = https.createServer(options, function (req, res) {
        res.writeHead(200);
        res.end("hello world\n");
      }).listen(4433);


      // client
      let reqOptions = {
        url: 'https://localhost:4433',
        agentOptions: {
          cert: certs.clientCert,
          key: certs.clientKey
        }
      };

      request.get(reqOptions, function(error, response, body) {
        // if you get 'socket hung up' for the error something went wrong
        // 'hello world' should be logged to console
        console.log(body);
        server.close();
      });

    });
