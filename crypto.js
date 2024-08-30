const crypto = require('crypto');

// Générer une clé aléatoire de 16 octets (128 bits)
const nwkKey = crypto.randomBytes(16).toString('hex').toUpperCase();

// Générer un NetID aléatoire de 3 octets (24 bits)
const netIDBuffer = crypto.randomBytes(3);
const netID = netIDBuffer.toString('hex').toUpperCase();

// Générer une DevAddr aléatoire de 4 octets (32 bits)
// La DevAddr commence par les bits dérivés du NetID
const devAddrBuffer = Buffer.alloc(4);
netIDBuffer.copy(devAddrBuffer, 0, 0, 2); // Copier les 16 premiers bits du NetID dans la DevAddr
devAddrBuffer[2] = crypto.randomBytes(1)[0]; // Ajouter des bits supplémentaires pour la DevAddr
devAddrBuffer[3] = crypto.randomBytes(1)[0];

const devAddr = devAddrBuffer.toString('hex').toUpperCase();

console.log(`NwkKey : ${nwkKey}`);

console.log(`NetID: ${netID}`);
console.log(`DevAddr: ${devAddr}`);
