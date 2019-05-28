import * as path from 'path';
import * as childProcess from 'child_process';
import config from 'config';

async function main(): Promise<void> {
    const p = childProcess.spawn('updatedb',
        [`--localpaths='${(config.get('index.dataDir') as string).replace(' ', '\ ')}'`, `--output=${config.get('index.dbName')}`],
        {}
    );

    p.stdout.on('data', (line: Buffer): void => {
        console.log(line.toString());
    });

    p.stderr.on('data', (line: Buffer): void => {
        console.error(line.toString());
    })

    p.on('message', (msg): void => {
        console.log(msg);
    });

    p.on('error', (err): void => {
        console.error('Failed to update db (on error)');
        console.error(err);
    });

    p.on('close', (code, signal): void => {
        if (code !== 0) {
            console.error('Failed to update db (on close)');
            console.error(code, signal);
            return;
        }
        console.info('DB is updated. (on close)');
    });

    p.on('exit', (code, signal): void => {
        if (code !== 0) {
            console.error('Failed to update db (on exit)');
            console.error(code, signal);
            return;
        }
        console.info('DB is updated. (on close)');
    });
}

console.info(`index.dataDir: ${config.get('index.dataDir')}`);
console.info(`index.dataDir: ${config.get('index.dbName')}`);

main();
