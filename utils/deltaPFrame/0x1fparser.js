/**
 * Function that parse a 0x1f Delta P frame from the sensor
 */
function parseDeltap0x1fFrame(payload) {
    // Create an object to hold the parsed configuration data
    // register 380: Configuration TOR1 (button)
    // register 381: Alarm threshold TOR1
    // register 382: Configuration TOR2 (button)
    // register 383: Alarm threshold TOR2
    const content = {
        type: '0x1f Delta P channels configuration',
        channel1_configuration_type: getTypeText(payload[2] & 0x0f),
        channel1_configuration_debounce_duration: getDebounceDurationText((payload[2] & 0xf0) >> 4),
        channel1_alarm_threshold: payload.readUInt16BE(3),
        channel2_configuration_type: getTypeText(payload[5] & 0x0f),
        channel2_configuration_debounce_duration: getDebounceDurationText((payload[5] & 0xf0) >> 4), 
        channel2_alarm_threshold: payload.readUInt16BE(6)
    };

    return content;
}

function getDebounceDurationText(value) {
    switch (value) {
      case 0x0:
        return 'no_debounce';
      case 0x1:
        return '10msec';
      case 0x2:
        return '20msec';
      case 0x3:
        return '50msec';
      case 0x4:
        return '100msec';
      case 0x5:
        return '200msec';
      case 0x6:
        return '500msec';
      case 0x7:
        return '1s';
      case 0x8:
        return '2s';
      case 0x9:
        return '5s';
      case 0xa:
        return '10s';
      case 0xb:
        return '20s';
      case 0xc:
        return '40s';
      case 0xd:
        return '60s';
      case 0xe:
        return '5min';
      case 0xf:
        return '10min';
      default:
        return '';
    }
}

function getTypeText(value) {
    switch (value) {
      case 0x0:
        return 'deactivated';
      case 0x1:
        return 'event_on';
      case 0x2:
        return 'event_off';
      case 0x3:
        return 'event_on_off';
      default:
        return '';
    }
}

module.exports = { parseDeltap0x1fFrame };
