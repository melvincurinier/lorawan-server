// Define ANSI color codes for various colors
const colors = {
    'reset': '\x1b[0m',     // Reset color
    'red': '\x1b[31m',      // Red color
    'green': '\x1b[32m',    // Green color
    'yellow': '\x1b[33m',   // Yellow color
    'blue': '\x1b[34m',     // Blue color
    'magenta': '\x1b[35m',  // Magenta color
    'cyan': '\x1b[36m',     // Cyan color
    'white': '\x1b[37m',    // White color
};

/**
 * A function that format a message with a prefix and a specified color
 */
function colorMessage(prefix, message, color){
    const coloredMessage = colors[color] +  prefix + ' ' + message + colors['reset'];
    return coloredMessage;
}

/**
 * A function that log a colored message to the console
 */
function coloredLog(prefix, message, color) {
    console.log(colorMessage(prefix, message, color));
}

/**
 * A function that log a colored error message to the console
 */
function coloredErrorLog(prefix, message, color) {
    console.error(colorMessage(prefix, message, color));
}

/**
 * A function that log database messages or errors
 */
function logDatabase(message, error) {
    if(error) coloredErrorLog('DATABASE >> ', message, 'red');
    else coloredLog('DATABASE >> ', message, 'green');
}

/**
 * A function that log broker messages or errors
 */
function logBroker(message, error) {
    if(error) coloredErrorLog('BROKER >> ', message, 'red');
    else coloredLog('BROKER >> ', message, 'cyan');
}

/**
 * A function that log server messages or errors
 */
function logServer(message, error) {
    if(error) coloredErrorLog('SERVER >> ', message, 'red');
    else coloredLog('SERVER >> ', message, 'yellow');
}

// Export the logging functions for use in other modules
module.exports = { logDatabase, logBroker, logServer };