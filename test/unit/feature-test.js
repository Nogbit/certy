import certy from '../../src/index';
import https   from 'https';
import request from 'request';

describe('x509 cert creation', function() {
  this.timeout(10000);

  it('should not have errored when creating certs', (done) => {
    certy.create(function (err, certs) {
      let keys = ['serverKey', 'serverCert', 'clientCert', 'clientKey', 'ca'];
      expect(err).to.be.null;
      expect(certs).to.contain.all.keys(keys);
      done();
    });
  });

  it('should be used successfully in an https request', (done) => {
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
        expect(body).to.contain('hello world');
        server.close();
        done();
      });
    });
  });
});
