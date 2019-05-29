import path from 'path';
import config from 'config';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import ffmpeg from 'fluent-ffmpeg';

import search from './search';

const app = new Koa();

const router = new KoaRouter();
router
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
    })
    .get('/video/:path*', async(ctx): Promise<void> => {
        console.debug(ctx.params.path);
        ctx.res.setHeader('Content-Type', 'video/webm')
        const videoPath = path.join(config.get('index.dataDir'), ctx.params.path);
        console.debug(videoPath);
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
        //proc.pipe(ctx.response.body);

        proc.on('error', (err): void => {
            console.error('ffmpeg error');
            console.error(err);
        })
        ctx.response.body = proc.pipe();


        ctx.req.on('close', (): void => {
            console.log(`Video request for ${ctx.params.path} is closed.`);
            //proc.kill('SIGTERM');
        });
    });

app
    .use(router.routes())
    .use(koaStatic(path.join(__dirname, '../dist/web')))
    .listen(config.get('app.port'), (): void => {
        console.info(`Koa started on port ${config.get('app.port')}.`);
    });
