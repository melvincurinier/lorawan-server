const { parseDeltap0x10Frame} = require('./deltaPFrame/0x10parser');
const { parseDeltap0x11Frame} = require('./deltaPFrame/0x11parser');
const { parseDeltap0x1fFrame } = require('./deltaPFrame/0x1fparser');
const { parseDeltap0x51Frame } = require('./deltaPFrame/0x51parser');
const { parseDeltap0x52Frame } = require('./deltaPFrame/0x52parser');
const { parseDeltap0x53Frame } = require('./deltaPFrame/0x53parser');

function decodeDeltaPFrame(payload) {
    const bytes = Buffer.from(payload, 'hex');
    const frame = {};

    // Premier octet : Code de la trame
    frame.code = bytes[0];

    // Deuxième octet : Statut
    const statusByte = bytes[1];
    frame.frameCounter = (statusByte >> 5) & 0x07; // Bits 7-5
    frame.configurationError = (statusByte >> 4) & 0x01; // Bit 4
    frame.hardwareError = (statusByte >> 3) & 0x01; // Bit 3
    frame.lowBattery = (statusByte >> 2) & 0x01; // Bit 2
    frame.configDone = (statusByte >> 1) & 0x01; // Bit 1
    frame.noError = statusByte & 0x01; // Bit 0

    // Traitement en fonction du code de trame
    switch (frame.code) {
        case 0x10:
            Object.assign(frame, parseDeltap0x10Frame(bytes));
            break;
        case 0x11:
            Object.assign(frame, parseDeltap0x11Frame(bytes));
            break;
        case 0x1f:
            Object.assign(frame, parseDeltap0x1fFrame(bytes));
            break;
        case 0x30:
            frame.type = '0x30 Keep alive';
            break;
        case 0x51:
            Object.assign(frame, parseDeltap0x51Frame(bytes));
            break;
        case 0x52:
            Object.assign(frame, parseDeltap0x52Frame(bytes));
            break;
        case 0x53:
            Object.assign(frame, parseDeltap0x53Frame(bytes));
            break;

        case 0x54:
            // Trame d'alarme Delta de pression
            frame.type = 'Delta Pressure Alarm';
            frame.deltaPressure = (bytes[2] << 8) | bytes[3];
            frame.thresholdExceeded = (bytes[4] << 8) | bytes[5];
            break;

        case 0x55:
            // Trame d'alarme périodique capteur
            frame.type = 'Sensor Alarm';
            frame.sensorType = bytes[2];
            frame.alarmCode = bytes[3];
            break;

        default:
            frame.type = 'Unknown';
            frame.payload = bytes.slice(2);
            break;
    }

    return frame;
}

// Exemple d'utilisation
const hexString = "3008";
const decodedFrame = decodeDeltaPFrame(hexString);
console.log(decodedFrame);
