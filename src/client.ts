import * as express from 'express';
import * as uuid from 'uuid';
import * as bodyParser from 'body-parser';
import * as request from 'request-promise';
import * as co from 'co';

export class Client {

    private id: string;
    private state: string;
    public heartbeatTimeoutTimestamp: number;
    public electionTimeoutTimestamp: number;
    private app: express.Application;
    private term: number;
    private interval: NodeJS.Timer;

    constructor(private port: number, private clients: string[]) {
        this.id = uuid.v4();
        this.term = 0;
        this.setAsFollower();

        this.app = express();
        this.app.use(bodyParser.json());

        this.app.get('/heartbeat', (req: express.Request, res: express.Response) => {
            this.heartbeat(req, res);
        });

        this.app.get('/vote', (req: express.Request, res: express.Response) => {
            this.vote(req, res);
        });
    }

    // Public Methods

    public start(): void {

        this.app.listen(this.port);

        this.interval = setInterval(() => {
            this.cycle();
        }, 200);

    }

    public stop() {
        clearInterval(this.interval);
    }

    // Express App Methods

    private heartbeat(req: express.Request, res: express.Response): void {
        this.resetHeartBeatTimeout();
        if (!this.isFollower()) {
            this.setAsFollower();
        }

        res.json();
    }

    private vote(req: express.Request, res: express.Response): void {
        const result = req.query.term > this.term;

        res.json(result);
    }

    // Interval Methods

    private cycle(): void {
        if (this.isFollower()) {
            if (this.hasExceededHeartbeatTimeout()) {
                this.setAsCandidate();
            } else {
                // Do nothing
            }
        } else if (this.isCandidate()) {
            if (this.hasExceededElectionTimeout()) {
                this.sendVoteRequests();
            }
        } else if (this.isLeader()) {
            this.sendHeartbeat();
        }
    }

    // Raft Algorithm Methods

    public sendVoteRequests(): void {
        const self = this;
        co(function* () {

            self.incrementTerm();

            let count = 0;

            for (const client of self.clients) {

                try {
                    const result: boolean = yield request({
                        uri: `${client}/vote?term=${self.term}`,
                        json: true
                    });

                    if (result) {
                        count = count + 1;
                    }

                } catch (err) {

                }
            }

            if (count > Math.floor((self.clients.length) / 2)) {
                console.log(`${self.id}: I'm the leader!!`);
                self.setAsLeader();
            }
        });
    }

    private sendHeartbeat(): void {
        for (const client of this.clients) {
            request({
                uri: `${client}/heartbeat`,
                json: true
            }).then((result: boolean) => {

            }).catch((err: Error) => {
                console.log(`Could not connect to ${client}`);
            });
        }
    }

    private hasExceededHeartbeatTimeout(): boolean {
        return new Date().getTime() > this.heartbeatTimeoutTimestamp;
    }

    private hasExceededElectionTimeout(): boolean {
        return new Date().getTime() > this.electionTimeoutTimestamp;
    }

    // Helper Methods

    private resetHeartBeatTimeout(): void {
        this.heartbeatTimeoutTimestamp = new Date().getTime() + 1000;
    }

    private clearHeartBeatTimeout(): void {
        this.heartbeatTimeoutTimestamp = null;
    }

    private incrementTerm(): void {
        this.term = this.term + 1;
    }

    private setAsFollower(): void {
        this.state = 'follower';
        this.resetHeartBeatTimeout();
        this.electionTimeoutTimestamp = null;
    }

    private setAsCandidate(): void {
        this.state = 'candidate';
        this.clearHeartBeatTimeout();
        this.electionTimeoutTimestamp = new Date().getTime() + this.getRandomArbitrary(1000, 4000);
    }

    private setAsLeader(): void {
        this.state = 'leader';
        this.clearHeartBeatTimeout();
        this.electionTimeoutTimestamp = null;
    }

    private isFollower(): boolean {
        return this.state === 'follower';
    }

    private isCandidate(): boolean {
        return this.state === 'candidate';
    }

    private isLeader(): boolean {
        return this.state === 'leader';
    }

    // Other Methods
    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

}