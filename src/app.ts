import path from 'path';
import util from 'util';
import config from 'config';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import ffmpeg from 'fluent-ffmpeg';

import search from './search';

const app = new Koa();

const router = new KoaRouter();

function sanitizePath(pathString: string): string {
    const normalized = path.normalize(pathString);
    return normalized.replace(/^(\.\.(\/|\\|$))+/, '');
}

router.use('/api', new KoaRouter()
    .get('/search', async(ctx): Promise<void> => {
        console.debug(ctx.query.q);

        const query = ctx.query.q;
        const {cancel, resultStream} = search(query);

        ctx.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        ctx.body = resultStream;

        ctx.req.on('close', (): void => {
            console.log(`Search request for ${query} is closed.`);
            cancel();
        });

        resultStream.on('error', (): void => {
            ctx.res.end();
        });

        resultStream.on('close', (): void => {
            ctx.res.end();
        });
    })
    .get('/video/:path*', async(ctx): Promise<void> => {
        ctx.res.setHeader('Content-Type', 'video/webm')
        const videoPath = path.join(config.get('index.dataDir'), sanitizePath(ctx.params.path));
        const time = ctx.query.time || 0;
        console.debug('time: ', time);
        console.debug('videoPath: ', videoPath);
        const proc = ffmpeg(videoPath)
            .format('webm')
            .addOption('-deadline realtime')
            .addOption('-speed 4')
            .addOption('-cpu-used -8')
            .videoCodec('libvpx-vp9')
            .size('720x?')
            .videoBitrate('512k')
            .audioBitrate('96k')
            .audioCodec('libvorbis')
            .seekInput(time);
        //proc.pipe(ctx.response.body);

        proc.on('error', (err: Error): void => {
            if (err.message === 'Output stream closed') {
                proc.kill('SIGKILL');
                return;
            }
            console.error(err.message);
            proc.kill('SIGKILL');
        })
        ctx.response.body = proc.pipe();

        ctx.req.on('close', (): void => {
            console.log(`Video request for ${ctx.params.path} is closed.`);
            proc.kill('SIGKILL');
        });
    })
    .get('/duration/:path*', async(ctx): Promise<void> => {
        const videoPath = path.join(config.get('index.dataDir'), sanitizePath(ctx.params.path));
        const metadata = await (util.promisify(ffmpeg.ffprobe) as (path: string) => Promise<ffmpeg.FfprobeData>)(videoPath)
        ctx.body = {
            duration: metadata.format.duration
        };
    }).routes()
);

app
    .use(router.routes())
    .use(koaMount('/assets', koaStatic(path.join(__dirname, '../dist/web/assets'))))
    .use(async (ctx, next): Promise<void> => {
        ctx.request.path = '/index.html'
        await next();
    })
    .use(koaStatic(path.join(__dirname, '../dist/web/')))
    .listen(config.get('app.port'), (): void => {
        console.info(`Koa started on port ${config.get('app.port')}.`);
    });
