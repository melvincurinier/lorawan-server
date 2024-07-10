// Quick start, create an active ftp server.
const FtpSrv = require('ftp-srv');

const port=process.env.FTP_PORT;
const ftpServer = new FtpSrv({
    url: `ftp://${process.env.FTP_HOSTNAME}:${port}`
});

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => { 
    if(username === 'user' && password === 'password'){
        return resolve({ root:"../data/ftp" });    
    }
    return reject(new Error('Invalid username or password'));
});

ftpServer.listen().then(() => { 
    console.log('Ftp server is starting...')
});