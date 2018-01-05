import * as childProcess from 'child_process';
import * as path from 'path';

const nodes = [];

for (const port of ['3001', '3002', '3003', '3004', '3005']) {
    const node = childProcess.spawn('node', [
        path.join(__dirname, 'app.js'),
        '--port',
        port,
    ]);

    node.stdout.on('data', (data) => {
        console.log(`stdout from ${port}: ${data}`);
    });

    node.stderr.on('data', (data) => {
        console.log(`stderr from ${port}: ${data}`);
    });

    nodes.push(node);
}


process.on('exit', (code) => {
    for (const node of nodes) {
        node.kill('SIGINT');
    }
});