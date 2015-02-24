var exec  = require('child_process').exec;
import ssl from './commands';
import fs  from 'fs';

const certy = {
  create(cb) {
    var path   = __dirname;
    var output = '';
    var input  = '';
    if (path.indexOf('/src', path.length - 4) > 0) {
      output = path.replace('/src', '/output');
      input = path.replace('/src', '/input');
    } else {
      output = path.replace('/dist', '/output');
      input = path.replace('/dist', '/input');
    }

    let commands = ssl.list(input, output);

    // Create our certificate authority
    exec(commands.ca, () => {
      // Create server private key
      exec(commands.serverKey, () => {
        // Create a CSR
        exec(commands.serverCSR, () => {
          // Sing the request
          exec(commands.serverSign, () => {
            // create client private key
            exec(commands.clientKey, () => {
              // create the CSR
              exec(commands.clientCSR, () => {
                // sign the request...using the same CA
                exec(commands.clientSign, () => {

                  var certs = {
                    serverKey: fs.readFileSync(`${output}/server-key.pem`),
                    serverCert: fs.readFileSync(`${output}/server-crt.pem`),
                    clientCert: fs.readFileSync(`${output}/client-crt.pem`),
                    clientKey: fs.readFileSync(`${output}/client-key.pem`),
                    ca: fs.readFileSync(`${output}/ca-crt.pem`)
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

export default certy;
