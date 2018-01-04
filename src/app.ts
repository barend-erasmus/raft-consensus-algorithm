import * as yargs from 'yargs';
import { Node } from './Node';
import { HTTPTransportLayer } from './transport';
import { setTimeout } from 'timers';

const argv = yargs.argv;

const transportLayer = new HTTPTransportLayer(argv.port);
transportLayer.addNode(`localhost:3001`);
transportLayer.addNode(`localhost:3002`);
transportLayer.addNode(`localhost:3003`);
transportLayer.addNode(`localhost:3004`);
transportLayer.addNode(`localhost:3005`);

const node = new Node(`localhost:${argv.port}`, transportLayer);

transportLayer.setNode(node);

function start() {
    setTimeout(() => {
        node.tick().then(() => {
            start();
        });
    }, 1500);
}

start();