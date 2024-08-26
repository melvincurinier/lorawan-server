const { parseDeltap0x51Frame } = require('./0x51parser');

/**
 * Function that parse a 0x52 Delta P (TOR2 alarm) frame from the sensor
 */
function parseDeltap0x52Frame(payload) {
    const content = { 
        ...parseDeltap0x51Frame(payload),
        type: '0x52 Delta P - TOR2 alarm'
    };

    return content;
}

module.exports = { parseDeltap0x52Frame };
