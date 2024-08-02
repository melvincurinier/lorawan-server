// Load environment variables from .env file
require('dotenv').config();

// Import modules
const FtpSrv = require('ftp-srv');
const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');
const { addSocomecDataFromStream } = require('../controllers/socomecFtpController');
const { logFTP } = require('../util/coloredLog');
const { checkDbConnection } = require('./mysql');

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

// FTP config
const ftp_url = process.env.FTP_HOSTNAME;
const ftp_port = process.env.FTP_PORT;

// Create a new FTP server instance
const ftpServer = new FtpSrv({
  url: `ftp://${ftp_url}:${ftp_port}`,
  pasv_url: resolverFunction // Passive mode URL resolver function
});

// Event listener for login attempts
ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
  if (username === process.env.FTP_AUTH_USERNAME && password === process.env.FTP_AUTH_PASSWORD) {
    resolve({ root: './data' }); // Root directory for authorized users
    logFTP(`User ${username} logged in`, false);
  } else {
    reject(new Error('Invalid username or password')); // Reject if authentication fails
  }

   // Event listener for file storage
  connection.on('STOR', (error, stream) => { 
    if(error){
      logFTP(`Error storing file: ${error}`, true);
      return;
    }
    logFTP(`File stored: ${stream}`, false);

    addSocomecDataFromStream(stream)
  });
});

// Event listener for disconnections
ftpServer.on('disconnect', ({connection}) => {
  const username = connection.username;
  logFTP(`User ${username} disconnected`, false);
});

// Event listener for server errors
ftpServer.on('error', (error) => {
  logFTP(`FTP Server error: ${error}`, true);
});

// Start the FTP server
ftpServer.listen()
.then(() => {
  logFTP(`FTP server is running on port ${ftp_port}`, false);
})
.catch(error => {
  logFTP(`Error starting FTP server: ${error.message}`, true);
});

// Check the status of database connection
checkDbConnection();