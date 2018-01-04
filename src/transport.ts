import { Node } from "./node";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as rp from 'request-promise';

export abstract class ITransportLayer {
    public nodes: string[] = [];

    public async requestVote(term: number, sourceNodeId: string, destinationNodeId: string): Promise<boolean> {
        return true;
    }

    public async sendHeartbeat(term: number, sourceNodeId: string, destinationNodeId: string): Promise<void> {

    }
}

export class InMemoryTransportLayer extends ITransportLayer {

    private nodeInstances: Node[] = [];

    constructor() {
        super();
    }

    public async requestVote(term: number, sourceNodeId: string, destinationNodeId: string): Promise<boolean> {
        const node = this.nodeInstances.find((x) => x.id === destinationNodeId);

        return node.vote(term, sourceNodeId);
    }

    public async sendHeartbeat(term: number, sourceNodeId: string, destinationNodeId: string): Promise<void> {
        const node = this.nodeInstances.find((x) => x.id === destinationNodeId);

        node.heartbeat(term, sourceNodeId);
    }

    public addNode(node: Node): void {
        this.nodeInstances.push(node);
        this.nodes.push(node.id);
    }
}

export class HTTPTransportLayer extends ITransportLayer {

    private app = express();

    private node: Node = null;

    constructor(private port: number) {
        super();

        this.app.use(bodyParser.json());

        this.app.get('/heartbeat', async (req, res) => {
            await this.node.heartbeat(req.query.term, req.query.id);
            res.json(true);
        });

        this.app.get('/request-vote', async (req, res) => {
            const result: boolean = this.node.vote(req.query.term, req.query.id);
            res.json(result);
        });

        this.app.listen(this.port, () => console.log(`listening on port ${this.port}`));
    }

    public async requestVote(term: number, sourceNodeId: string, destinationNodeId: string): Promise<boolean> {

        try {
            const result = await rp({
                uri: `http://${destinationNodeId}/request-vote`,
                qs: {
                    term,
                    id: sourceNodeId,
                },
                json: true
            });

            return result;

        } catch (err) {
            return null;
        }
    }

    public async sendHeartbeat(term: number, sourceNodeId: string, destinationNodeId: string): Promise<void> {

        try {
            const result = await rp({
                uri: `http://${destinationNodeId}/heartbeat`,
                qs: {
                    term,
                    id: sourceNodeId,
                },
                json: true
            });

        } catch (err) {
        }
    }

    public addNode(node: string): void {
        this.nodes.push(node);
    }

    public setNode(node: Node): void {
        this.node = node;
    }
}