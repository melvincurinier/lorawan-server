const colors = {
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'blue': '\x1b[34m',
    'reset': '\x1b[0m'
};

function colorMessage(message, color){
    const coloredMessage = colors[color] + message + colors['reset'];
    return coloredMessage;
}

function coloredLog(message, color) {
    console.log(colorMessage(message, color));
}

function coloredErrorLog(message, color) {
    console.error(colorMessage(message, color));
}

module.exports = { coloredLog, coloredErrorLog };