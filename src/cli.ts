import { Client } from './client';

const client1 = new Client(3000, [
    'http://localhost:4000',
    'http://localhost:5000',
    'http://localhost:6000',
]);

const client2 = new Client(4000, [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:6000',
]);

const client3 = new Client(5000, [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:6000',
]);

const client4 = new Client(6000, [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:5000',
]);


client1.start();
client2.start();
client3.start();
client4.start();

setTimeout(() => {
    client1.stop();
    client2.stop();
    client3.stop();
    client4.stop();
}, 5000);

setTimeout(() => {
    client1.start();
    client2.start();
    client3.start();
    client4.start();
}, 10000);