const colors = {
    'reset': '\x1b[0m',
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'yellow': '\x1b[33m',
    'blue': '\x1b[34m',
    'magenta': '\x1b[35m',
    'cyan': '\x1b[36m',
    'white': '\x1b[37m',
};

function colorMessage(prefix, message, color){
    const coloredMessage = colors[color] +  prefix + ' ' + message + colors['reset'];
    return coloredMessage;
}

function coloredLog(prefix, message, color) {
    console.log(colorMessage(prefix, message, color));
}

function coloredErrorLog(prefix, message, color) {
    console.error(colorMessage(prefix, message, color));
}

function logDatabase(message, error) {
    if(error) coloredErrorLog('DATABASE >> ', message, 'green');
    else coloredLog('DATABASE >> ', message, 'green');
}

function logBroker(message, error) {
    if(error) coloredErrorLog('BROKER >> ', message, 'cyan');
    else coloredLog('BROKER >> ', message, 'cyan');
}

function logServer(message, error) {
    if(error) coloredErrorLog('SERVER >> ', message, 'yellow');
    else coloredLog('SERVER >> ', message, 'yellow');
}



module.exports = { logDatabase, logBroker, logServer };