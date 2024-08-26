/**
 * Function that parse a 0x51 Delta P (TOR1 alarm) frame from the sensor
 */
function parseDeltap0x51Frame(payload) {
    const content = {
        type: '0x51 Delta P - TOR1 alarm', 
        alarm_status_tor_previous_frame: payload.readUInt8(2) >> 1 & 1,
        alarm_status_tor_current: payload.readUInt8(2) >> 0 & 1,
        global_digital_counter: payload.readUInt32BE(3),
        instantaneous_digital_counter: payload.readUInt16BE(7)
    };

    return content;
}

module.exports = { parseDeltap0x51Frame };
