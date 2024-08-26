/**
 * Function that parse a 0x11 Delta P frame from the sensor
 */
function parseDeltap0x11Frame(payload) {
    // Create an object to hold the parsed configuration data
    // Register 322: Number of samplings before historization
    // Register 323: Sampling period in seconds (multiplied by 2 because the raw value is in half-seconds)
    // Register 324: Number of historizations before sending
    const content = {
        type: '0x11 Delta P 0-10V configuration',
        number_of_sampling_before_historization: payload.readUInt16BE(2),
        sampling_period_sec: payload.readUInt16BE(4) * 2,
        number_of_historization_before_sending: payload.readUInt16BE(6),
        calculated_period_recording_sec: payload.readUInt16BE(2) * payload.readUInt16BE(4) * 2, // Calculated period of recording (in seconds)
        calculated_period_sending_sec: payload.readUInt16BE(2) * payload.readUInt16BE(4) * payload.readUInt16BE(6) * 2 // Calculated period of sending (in seconds)
    };

    return content;
}

module.exports = { parseDeltap0x11Frame };
