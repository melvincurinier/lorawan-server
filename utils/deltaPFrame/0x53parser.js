/**
 * Function that parse a 0x53 Delta P periodic frame from the sensor
 */
function parseDeltap0x53Frame(payload) {
    const content = {
        type: '0x53 Delta P periodic data',
        instantaneous_delta_pressure_pa: payload.readInt16BE(2),
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

    // Iterate over the payload, starting from the 5th byte (index 4) and advancing by 2 bytes at a time
    for (let offset = 4; offset < payload.byteLength; offset += 2) {
        const index = (offset - 2) / 2;
        const timeText = `tminus${index}`;
        content[`delta_pressure_${timeText}_pa`] = payload.readInt16BE(offset);
    }

    return content;
}

module.exports = { parseDeltap0x53Frame };