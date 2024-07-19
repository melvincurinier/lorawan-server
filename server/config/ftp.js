// Import modules
const FtpSrv = require('ftp-srv');
const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');
const { addSocomecDataFromStream } = require('../controllers/ftpController');
const fs = require('fs');

/**
 * A function that get network interfaces and their addresses
 */
function getNetworks() {
  const nets = networkInterfaces();
  let networks = {};
  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
              networks[net.address + "/24"] = net.address // Store address with subnet mask
          }
      }
  }
  return networks;
}

/**
 * A function to resolve the passive FTP URL based on the client's address
 */
const resolverFunction = (address) => {
  const networks = getNetworks();
  for (const network in networks) {
      if (new Netmask(network).contains(address)) {
          return networks[network]; // Return the matching network address
      }
  }
  return "127.0.0.1"; // Return localhost if no match
}

// Create a new FTP server instance
const ftpServer = new FtpSrv({
  url: `ftp://${process.env.FTP_HOSTNAME}:${process.env.FTP_PORT}`,
  pasv_url: resolverFunction // Passive mode URL resolver function
});

// Event listener for login attempts
ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
  if (username === process.env.FTP_AUTH_USERNAME && password === process.env.FTP_AUTH_PASSWORD) {
    resolve({ root: './data' }); // Root directory for authorized users
    console.log(`User ${username} logged in`);
  } else {
    reject(new Error('Invalid username or password')); // Reject if authentication fails
  }

   // Event listener for file storage
  connection.on('STOR', (error, stream) => { 
    if(error){
      console.error('Error storing file: ', error);
      return;
    }
    console.log(`File stored: ${stream}`);

    addSocomecDataFromStream(stream)
  });
});

// Event listener for disconnections
ftpServer.on('disconnect', ({connection}) => {
  const username = connection.username;
  console.log(`User ${username} disconnected`);
});

// Event listener for server errors
ftpServer.on('error', (error) => {
  console.error('FTP Server error:', error);
});

// Start the FTP server
ftpServer.listen()
  .then(() => {
      console.log('FTP server is running on port 21');
  })
  .catch(error => {
    console.error(`Error starting FTP server: ${error.message}`);
  });