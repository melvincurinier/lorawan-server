/**
 * Function that parse a 0x10 Delta P frame from the sensor
 */
function parseDeltap0x10Frame(payload) {
    // Create an object to hold the parsed configuration data
    // Register 300: Emission period of the life frame (in seconds)
    // Register 301: Issue period (number of historization before sending)
    // Register 320: Number of samplings before historization
    // Register 321: Sampling period in seconds (multiplied by 2 because the raw value is in half-seconds)
    const content = {
        type: '0x10 Delta P configuration', 
        transmission_period_keep_alive_sec: payload.readUInt16BE(2) * 10, // This value is multiplied by 10 because the raw value is in deciseconds
        number_of_historization_before_sending: payload.readUInt16BE(4),
        number_of_sampling_before_historization: payload.readUInt16BE(6),
        sampling_period_sec: payload.readUInt16BE(8) * 2,
        calculated_period_recording_sec: payload.readUInt16BE(8) * payload.readUInt16BE(6) * 2, // Calculated period of recording (in seconds)
        calculated_period_sending_sec: payload.readUInt16BE(8) * payload.readUInt16BE(6) * payload.readUInt16BE(4) * 2 // Calculated period of sending (in seconds)
    };

    return content;
}

module.exports = { parseDeltap0x10Frame };
