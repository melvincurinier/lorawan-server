/**
 * Function that parse a 0x54 Delta P (pressure alarm) frame from the sensor
 */
function parseDeltap0x54Frame(payload) {
    const content = {
        type: '0x54 Delta P alarm', 
        alarm_status_delta_pressure: payload.readUInt8(2) & 1,
        delta_pressure_pa: payload.readUInt16BE(3)
    };

    return content;
}

module.exports = { parseDeltap0x54Frame };
