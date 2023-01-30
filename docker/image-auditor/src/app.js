const MULTICAST_ADRESS = '224.0.0.69'
const MULTICAST_PORT = '6691'
const TCP_PORT = '2205';

const net = require('net');
const dgram = require('dgram');
const udp_listener = dgram.createSocket('udp4');
udp_listener.bind(MULTICAST_PORT, () => {
    udp_listener.addMembership(MULTICAST_ADRESS);
    console.log("Auditor now listening");
})

var instruments = new Map();
instruments.set("ti-ta-ti", "piano");
instruments.set("pouet", "trumpet");
instruments.set("trulu", "flute");
instruments.set("gzi-gzi", "violin");
instruments.set("boum-boum", "drum");
var musicians = [];

// Récépetion des datagrammes UDP (payload des musiciens)
udp_listener.on('message', (msg, src) => {
    // uuid et sound
    var payload = JSON.parse(msg.toString());
    var instrument = instruments.get(payload.sound);
    var already_exists = false;
    musicians.forEach(musician => {
        if (musician.uuid == payload.uuid) {
            already_exists = true;
            musician.activeSince = Date.now();
        }
    })
    if (!already_exists) {
        musicians.push(new Musician(payload.uuid, instrument, Date.now()));
        console.log("New musician with uuid " + payload.uuid + " added !");
    }
    console.log("Received : " + payload.sound + " from " + payload.uuid);
});

const tcp_server = net.createServer();
tcp_server.listen(TCP_PORT);

tcp_server.on('connection', (socket) => {
    console.log("New TCP connection !");
    musicians.forEach(musician => {
        if (Date.now() - musician.activeSince > 5000) {
            const index = musicians.indexOf(musician);
            const x = musicians.splice(index, 1);
            console.log("Musician " + musician.uuid + " removed !");
        }
    });
    console.log(musicians);
    socket.write(JSON.stringify(musicians));
    socket.destroy();
});

class Musician {
    constructor(uuid, instrument) {
        this.uuid = uuid;
        this.instrument = instrument;
        this.activeSince = Date.now();
    }
}