var commands = {
  list: function (input, output) {
  return {
 ca: `openssl req -new -x509 -days 9999 -config ${input}/ca.cnf -keyout ${output}/ca-key.pem -out ${output}/ca-crt.pem`,

 serverKey: `openssl genrsa -out ${output}/server-key.pem 4096`,

 serverCSR: `openssl req -new -config ${input}/ca.cnf -key ${output}/server-key.pem -out ${output}/server-csr.pem`,

 serverSign: `openssl x509 -req -extfile ${input}/ca.cnf -days 999 -passin "pass:password" -in ${output}/server-csr.pem -CA ${output}/ca-crt.pem -CAkey ${output}/ca-key.pem -CAcreateserial -out ${output}/server-crt.pem`,

 clientKey: `openssl genrsa -out ${output}/client-key.pem 4096`,

 clientCSR: `openssl req -new -config ${input}/client.cnf -key ${output}/client-key.pem -out ${output}/client-csr.pem`,

 clientSign: `openssl x509 -req -extfile ${input}/client.cnf -days 999 -passin "pass:password" -in ${output}/client-csr.pem -CA ${output}/ca-crt.pem -CAkey ${output}/ca-key.pem -CAcreateserial -out ${output}/client-crt.pem`
  };
}};

export default commands;
