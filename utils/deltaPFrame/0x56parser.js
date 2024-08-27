/**
 * Function that parse a 0x56 Delta P (alarm 0-10 V) frame from the sensor
 */
function parseDeltap0x56Frame(payload) {
    const content = {
        type: '0x56 Delta P - alarm 0-10 V', 
        alarm_status_voltage: payload.readUInt8(2) & 1,
        voltage_mv: payload.readUInt16BE(3)
    };

    return content;
}

module.exports = { parseDeltap0x56Frame };
