const { parseDeltap0x10Frame} = require('./deltaPFrame/0x10parser');
const { parseDeltap0x11Frame} = require('./deltaPFrame/0x11parser');
const { parseDeltap0x1fFrame } = require('./deltaPFrame/0x1fparser');
const { parseDeltap0x51Frame } = require('./deltaPFrame/0x51parser');
const { parseDeltap0x52Frame } = require('./deltaPFrame/0x52parser');
const { parseDeltap0x53Frame } = require('./deltaPFrame/0x53parser');
const { parseDeltap0x54Frame } = require('./deltaPFrame/0x54parser');
const { parseDeltap0x55Frame } = require('./deltaPFrame/0x55parser');
const { parseDeltap0x56Frame } = require('./deltaPFrame/0x56parser');

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
            Object.assign(frame, parseDeltap0x54Frame(bytes));
            break;
        case 0x55:
            Object.assign(frame, parseDeltap0x55Frame(bytes));
            break;
        case 0x56:
            Object.assign(frame, parseDeltap0x56Frame(bytes));
            break;
        default:
            frame.type = 'Unknown';
            frame.payload = bytes.slice(2);
            break;
    }

    return frame;
}

// Exemple d'utilisation
const hexString = "1000000c00010002012c";
const decodedFrame = decodeDeltaPFrame(hexString);
console.log(decodedFrame);
