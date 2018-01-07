import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { Node } from './node';
import { InMemoryTransportLayer } from './transport';

describe('Node', () => {
    // describe('follower', () => {
    //     it('becomes candidate given heartbeat timeout exceeded', async () => {
    //         const transportLayer = new InMemoryTransportLayer();

    //         const node1 = new Node('1', transportLayer);
    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.tick();

    //         expect(node1.state).to.be.eq('candidate');
    //     });

    //     it('remains follower given heartbeat timeout not exceeded', async () => {
    //         const transportLayer = new InMemoryTransportLayer();

    //         const node1 = new Node('1', transportLayer);
    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.heartbeat(0, node2.id);
    //         await node1.tick();

    //         expect(node1.state).to.be.eq('follower');
    //     });
    // });

    // describe('candidate', () => {
    //     it('starts election and becomes leader given node gets majority of the votes', async () => {
    //         const transportLayer = new InMemoryTransportLayer();

    //         const node1 = new Node('1', transportLayer);
    //         node1.state = 'candidate';

    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.tick();

    //         expect(node1.state).to.be.eq('leader');
    //     });

    //     it('starts election and remains candidate given node gets less than majority of the votes', async () => {
    //         const transportLayer = new InMemoryTransportLayer();
    //         sinon.stub(transportLayer, 'requestVote').callsFake(() => {
    //             return Promise.resolve(false);
    //         });

    //         const node1 = new Node('1', transportLayer);
    //         node1.state = 'candidate';

    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.tick();

    //         expect(node1.state).to.be.eq('candidate');
    //     });

    //     it('becomes follower given node gets heartbeat with greater term', async () => {
    //         const transportLayer = new InMemoryTransportLayer();

    //         const node1 = new Node('1', transportLayer);
    //         node1.state = 'leader';

    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.heartbeat(1, node2.id);

    //         expect(node1.state).to.be.eq('follower');
    //     });
    // });

    // describe('leader', () => {
    //     it('becomes follower given node gets heartbeat with greater term', async () => {
    //         const transportLayer = new InMemoryTransportLayer();

    //         const node1 = new Node('1', transportLayer);
    //         node1.state = 'leader';

    //         const node2 = new Node('2', transportLayer);
    //         const node3 = new Node('3', transportLayer);
    //         const node4 = new Node('4', transportLayer);
    //         const node5 = new Node('5', transportLayer);

    //         transportLayer.addNode(node1);
    //         transportLayer.addNode(node2);
    //         transportLayer.addNode(node3);
    //         transportLayer.addNode(node4);
    //         transportLayer.addNode(node5);

    //         await node1.heartbeat(1, node2.id);

    //         expect(node1.state).to.be.eq('follower');
    //     });
    // });

    describe('election', () => {
        it('state equals leader given more than 3 votes and more than half the votes', async () => {
            const transportLayer = new InMemoryTransportLayer();
            const requestVoteStub = sinon.stub(transportLayer, 'requestVote');
            requestVoteStub.onCall(0).returns(Promise.resolve(true));
            requestVoteStub.onCall(1).returns(Promise.resolve(true));
            requestVoteStub.onCall(2).returns(Promise.resolve(true));
            requestVoteStub.onCall(3).returns(Promise.resolve(false));

            const node1 = new Node('1', transportLayer);
            node1.state = 'candidate';

            const node2 = new Node('2', transportLayer);
            const node3 = new Node('3', transportLayer);
            const node4 = new Node('4', transportLayer);
            const node5 = new Node('5', transportLayer);

            transportLayer.addNode(node1);
            transportLayer.addNode(node2);
            transportLayer.addNode(node3);
            transportLayer.addNode(node4);
            transportLayer.addNode(node5);

            await node1.election();

            expect(node1.state).to.be.eq('leader');
        });

        it('state equals candidate given more than 3 votes and less than half the votes', async () => {
            const transportLayer = new InMemoryTransportLayer();
            const requestVoteStub = sinon.stub(transportLayer, 'requestVote');
            requestVoteStub.onCall(0).returns(Promise.resolve(true));
            requestVoteStub.onCall(1).returns(Promise.resolve(true));
            requestVoteStub.onCall(2).returns(Promise.resolve(false));
            requestVoteStub.onCall(3).returns(Promise.resolve(false));

            const node1 = new Node('1', transportLayer);
            node1.state = 'candidate';

            const node2 = new Node('2', transportLayer);
            const node3 = new Node('3', transportLayer);
            const node4 = new Node('4', transportLayer);
            const node5 = new Node('5', transportLayer);

            transportLayer.addNode(node1);
            transportLayer.addNode(node2);
            transportLayer.addNode(node3);
            transportLayer.addNode(node4);
            transportLayer.addNode(node5);

            await node1.election();

            expect(node1.state).to.be.eq('candidate');
        });

        it('state equals candidate given less than 3 votes and more than half the votes', async () => {
            const transportLayer = new InMemoryTransportLayer();
            const requestVoteStub = sinon.stub(transportLayer, 'requestVote');
            requestVoteStub.onCall(0).returns(Promise.resolve(true));
            requestVoteStub.onCall(1).returns(Promise.resolve(false));

            const node1 = new Node('1', transportLayer);
            node1.state = 'candidate';

            const node2 = new Node('2', transportLayer);
            const node3 = new Node('3', transportLayer);

            transportLayer.addNode(node1);
            transportLayer.addNode(node2);
            transportLayer.addNode(node3);

            await node1.election();

            expect(node1.state).to.be.eq('candidate');
        });

        it('state equals candidate given requestVote returns null', async () => {
            const transportLayer = new InMemoryTransportLayer();
            const requestVoteStub = sinon.stub(transportLayer, 'requestVote');
            requestVoteStub.onCall(0).returns(Promise.resolve(null));
            requestVoteStub.onCall(1).returns(Promise.resolve(null));
            requestVoteStub.onCall(2).returns(Promise.resolve(null));
            requestVoteStub.onCall(3).returns(Promise.resolve(null));

            const node1 = new Node('1', transportLayer);
            node1.state = 'candidate';

            const node2 = new Node('2', transportLayer);
            const node3 = new Node('3', transportLayer);
            const node4 = new Node('4', transportLayer);
            const node5 = new Node('5', transportLayer);

            transportLayer.addNode(node1);
            transportLayer.addNode(node2);
            transportLayer.addNode(node3);
            transportLayer.addNode(node4);
            transportLayer.addNode(node5);

            await node1.election();

            expect(node1.state).to.be.eq('candidate');
        });
    });

    describe('heartbeat', () => {
        it('state equals follower given heartbeat equal term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(0, 'node2');

            expect(node1.state).to.be.eq('follower');
        });

        it('leader equals node id given heartbeat equal term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(0, 'node2');

            expect(node1.leader).to.be.eq('node2');
        });

        it('state equals follower given heartbeat greater term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(1, 'node2');

            expect(node1.state).to.be.eq('follower');
        });

        it('leader equals node id given heartbeat greater term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(1, 'node2');

            expect(node1.leader).to.be.eq('node2');
        });

        it('term equals new term given heartbeat greater term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(1, 'node2');

            expect(node1.term).to.be.eq(1);
        });

        it('term remains the same given heartbeat smaller term', async () => {
            const transportLayer = new InMemoryTransportLayer();

            const node1 = new Node('1', transportLayer);
            node1.state = 'leader';

            transportLayer.addNode(node1);

            await node1.heartbeat(-1, 'node2');

            expect(node1.term).to.be.eq(0);
        });
    });
});