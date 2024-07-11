const FtpSrv = require('ftp-srv');
const fs = require('fs');

const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');

const nets = networkInterfaces();
function getNetworks() {
   let networks = {};
   for (const name of Object.keys(nets)) {
       for (const net of nets[name]) {
           if (net.family === 'IPv4' && !net.internal) {
               networks[net.address + "/24"] = net.address
           }
       }
   }
   return networks;
}

const resolverFunction = (address) => {
   // const networks = {
   //     '$GATEWAY_IP/32': `${public_ip}`, 
   //     '10.0.0.0/8'    : `${lan_ip}`
   // } 
   const networks = getNetworks();
   for (const network in networks) {
       if (new Netmask(network).contains(address)) {
           return networks[network];
       }
   }
   return "127.0.0.1";
}

const ftp_url = process.env.FTP_HOSTNAME;
const ftp_port = process.env.FTP_PORT;

const ftpServer = new FtpSrv({
  url: `ftp://${ftp_url}:${ftp_port}`,
  anonymous: true,
  pasv_url: resolverFunction
});

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
  if (username === 'user' && password === 'password') {
    resolve({ root: './data' }); // Répertoire racine pour les utilisateurs autorisés
    console.log(`User ${username} logged in`);
  } else {
    reject(new Error('Invalid username or password'));
  }
  
});

ftpServer.on('error', (error) => {
  console.error('FTP Server error:', error);
});

ftpServer.listen()
  .then(() => {
      console.log('FTP server is running on port 21');
  })
  .catch(error => {
    console.error(`Error starting FTP server: ${error.message}`);
  });
