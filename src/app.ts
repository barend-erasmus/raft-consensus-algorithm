import { Client } from './client';

const client1 = new Client(7801, [
    'http://localhost:7802',
    'http://localhost:7803',
    'http://localhost:7804',
]);

const client2 = new Client(7802, [
    'http://localhost:7801',
    'http://localhost:7803',
    'http://localhost:7804',
]);

const client3 = new Client(7803, [
    'http://localhost:7801',
    'http://localhost:7802',
    'http://localhost:7804',
]);

const client4 = new Client(7804, [
    'http://localhost:7801',
    'http://localhost:7802',
    'http://localhost:7803',
]);


client1.start();
client2.start();
client3.start();
client4.start();

setTimeout(() => {
    // client1.stop();
    // client2.stop();
    // client3.stop();
    // client4.stop();
}, 7803);

setTimeout(() => {
    // client1.start();
    // client2.start();
    // client3.start();
    // client4.start();
}, 10000);