const FtpSrv = require('ftp-srv');
const fs = require('fs');
const path = require('path');

const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');



function getNetworks() {
  const nets = networkInterfaces();
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
  pasv_url: resolverFunction
});

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
  if (username === process.env.FTP_AUTH_USERNAME && password === process.env.FTP_AUTH_PASSWORD) {
    resolve({ root: './data' }); // Répertoire racine pour les utilisateurs autorisés
    console.log(`User ${username} logged in`);
  } else {
    reject(new Error('Invalid username or password'));
  }

  connection.on('STOR', (error, stream) => { 
    if(error){
      console.error('Error storing file: ', error);
      return;
    }
    console.log(`File stored : ${stream}`);
  });
});

ftpServer.on('disconnect', ({connection}) => {
  const username = connection.username;
  console.log(`User ${username} disconnected`);
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
