import * as stream from 'stream';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as readline from 'readline';
import config from 'config';

export default function search(query: string): { cancel: () => void; resultStream: stream.PassThrough } {
    const p = childProcess.spawn('fd',
        ['-t', 'f', '-e', 'mp4', query],
        { cwd: config.get('index.dataDir') }
    );

    const stdoutReader = readline.createInterface(p.stdout);
    const stderrReader = readline.createInterface(p.stderr);
    const strm = new stream.PassThrough();

    stdoutReader.on('line', (line: Buffer): void => {
        console.log(line.toString());
        strm.write(line.toString() + '\n', 'utf-8');
    });

    stderrReader.on('line', (line: Buffer): void => {
        console.error(line.toString());
    })

    p.on('error', (err): void => {
        console.error('Failed to search (on error)');
        console.error(err);
    });

    p.on('close', (code, signal): void => {
        if (code !== 0) {
            console.error('Failed to search (on close)');
            console.error(code, signal);
        }
        else {
            console.info('Search completed. (on close)');
        }
        strm.end();
    });

    p.on('exit', (code, signal): void => {
        if (code !== 0) {
            console.error('Failed to search (on exit)');
            console.error(code, signal);
            return;
        }
        console.info('Search completed. (on exit)');
    });

    return {
        cancel: (): void => {
            p.kill();
        },
        resultStream: strm
    }
}

