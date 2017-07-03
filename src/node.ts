export class Node {

    public state: string;
    public heartbeatTimeoutTimestamp: number;
    public electionTimeoutTimestamp: number;
    public term: number;

    constructor() {
        this.setAsFollower();
        this.term = 0;
    }

    public setAsFollower(): void {
        this.state = 'follower';
        this.setHeartBeatTimeout();
        this.electionTimeoutTimestamp = null;
    }

    public setAsCandidate(): void {
        this.state = 'candidate';
        this.clearHeartBeatTimeout();
        this.electionTimeoutTimestamp = new Date().getTime() + this.getRandomArbitrary(1000, 4000);
    }

    public setAsLeader(): void {
        this.state = 'leader';
        this.clearHeartBeatTimeout();
        this.electionTimeoutTimestamp = null;
    }

    public hasExceededHeartbeatTimeout(): boolean {
        return new Date().getTime() > this.heartbeatTimeoutTimestamp;
    }

    public hasExceededStateTimeout(): boolean {
        return new Date().getTime() > this.electionTimeoutTimestamp;
    }

    public setHeartBeatTimeout(): void {
        this.heartbeatTimeoutTimestamp = new Date().getTime() + 1000;
    }

    public clearHeartBeatTimeout(): void {
        this.heartbeatTimeoutTimestamp = null;
    }

    public sendVoteRequests(nodes: Node[]): void {
        let count = 0;
        this.term = this.term + 1;

        for (const node of nodes) {
            if (node.getVote(this.term)) {
                count = count + 1;
            }
        }

        for (const node of nodes) {
           node.setAsFollower();
        }

        if (count > Math.floor(nodes.length / 2)) {
            this.setAsLeader();
        }
    }

    public sendHeartbeat(nodes: Node[]): void {
        for (const node of nodes) {
            node.setHeartBeatTimeout();
        }
    }

    public getVote(term: number): boolean {
        return term > this.term;
    }

    public isFollower(): boolean {
        return this.state === 'follower';
    }

    public isCandidate(): boolean {
        return this.state === 'candidate';
    }

    public isLeader(): boolean {
        return this.state === 'leader';
    }

    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}