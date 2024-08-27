/**
 * Function that parse a 0x55 Delta P (periodic 0-10 V) frame from the sensor
 */
function parseDeltap0x55Frame(payload) {
    const content = {
        type: '0x55 Delta P - periodic 0-10 V',
        instantaneous_voltage_mv: payload.readInt16BE(2),
        ...getHistoricDataFromPayload(payload) // Spread operator is used here to merge historic data extracted by the getHistoricDataFromPayload function
    };

    return content;
}

/**
 * Function that retrieve historical data from the payload
 */
function getHistoricDataFromPayload(payload) {
    // Create an object to store historical data
    const content = {};

    // Loop through historic data (if present)
    for (let offset = 4; offset < payload.byteLength; offset += 2) {
        const index = (offset - 2) / 2;
        const timeText = `tminus${index}`;
        content[`voltage_${timeText}_mv`] = payload.readInt16BE(offset);
    }

    return content;
}

module.exports = { parseDeltap0x55Frame };