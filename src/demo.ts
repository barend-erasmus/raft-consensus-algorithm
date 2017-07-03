// Imports
import { Node } from './node';

const node1: Node = new Node();
const node2: Node = new Node();
const node3: Node = new Node();

const nodes: Node[] = [
    node1, node2, node3
];

console.log('start');

setInterval(() => {
    cycleNode(node1);
}, 100);

setInterval(() => {
    cycleNode(node2);
}, 100);

setInterval(() => {
    cycleNode(node3);
}, 100);

setInterval(() => {
    console.log(nodes.map((x) => x.state));
}, 1000);


function cycleNode(node: Node) {
    if (node.isFollower()) {
        if (node.hasExceededHeartbeatTimeout()) {
            node.setAsCandidate();
        } else {
            // Do nothing
        }
    } else if (node.isCandidate()) {
        if (node.hasExceededStateTimeout()) {
            node.sendVoteRequests(nodes);
        }
    } else if (node.isLeader()) {
        node.sendHeartbeat(nodes);
    }
}
