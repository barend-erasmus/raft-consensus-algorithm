import { ITransportLayer } from "./transport";

export class Node {

    public lastHeartbeatTimestamp: number = null;

    public heartbeatTimeout: number = 3000;

    public electionTimeout: number = null;

    public term: number = 0;

    public state: string = 'follower';

    public leader: string = null;

    constructor(public id: string, public transportLayer: ITransportLayer) {

    }

    public async election(): Promise<void> {

        this.term++;

        let numberOfVotes: number = 1;
        let numberOfNodes: number = 1;

        const tasks = this.transportLayer.nodes.filter((node) => node !== this.id).map((node) => this.transportLayer.requestVote(this.term, this.id, node));

        const results = await Promise.all(tasks);

        for (const result of results) {
            if (result !== null && result === true) {
                numberOfVotes++;
                numberOfNodes++;
            } else if (result !== null && result === false) {
                numberOfNodes++;
            }
        }

        if (numberOfVotes > 3 && numberOfVotes > numberOfNodes / 2) {
            this.state = 'leader';
            this.leader = null;
        }
    }

    public async heartbeat(term: number, nodeId: string): Promise<void> {
        if (term >= this.term) {
            this.term = term;
            this.lastHeartbeatTimestamp = new Date().getTime();
            this.state = 'follower';
            this.leader = nodeId;
        }
    }

    public async sendHeartbeat(): Promise<void> {
        const tasks = this.transportLayer.nodes.filter((node) => node !== this.id).map((node) => this.transportLayer.sendHeartbeat(this.term, this.id, node));

        const results = await Promise.all(tasks);
    }

    public async tick(): Promise<void> {
        if (this.state === 'follower' && this.timedOut()) {
            this.state = 'candidate';
        } else if (this.state === 'candidate') {
            await this.election();
        } else if (this.state === 'leader') {
            await this.sendHeartbeat();
        }

        console.log(`${this.state} - Leader: ${this.leader} [${this.term}]`);
    }

    public timedOut(): boolean {
        if (!this.lastHeartbeatTimestamp) {
            return true;
        }

        return new Date().getTime() - this.lastHeartbeatTimestamp > this.heartbeatTimeout;
    }

    public vote(term: number, node: string): boolean {
        if (term > this.term) {
            this.term = term;
            this.leader = node;
            return true;
        } else {
            return false;
        }
    }
}
