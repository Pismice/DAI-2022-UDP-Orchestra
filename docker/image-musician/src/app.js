const MULTICAST_ADRESS = '224.0.0.69'
const PORT = '6691'

const dgram = require('dgram');
const uuid = require('uuid');
const socket = dgram.createSocket('udp4');

var instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

var instrument = process.argv[2];
var sound = instruments.get(instrument);
var my_uuid = uuid.v4();
//var creation_date = Date.now();

setInterval(sendPayload, 1000);

function sendPayload() {
    var payload = JSON.stringify({
        uuid: my_uuid,
        sound: sound
    })

    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, PORT, MULTICAST_ADRESS, (err, bytes) => {
        console.log("Send this playload : " + payload);
    })
}