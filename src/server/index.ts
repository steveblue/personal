import { installShimOnGlobal } from './shim.js';

installShimOnGlobal();

import path from 'path';
import chalk from 'chalk';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { UserConfig } from 'vite';

import { config } from './config';

import { ssrMiddleware } from './middleware/ssr.js';

import { BlogController } from './api/blog';
import { TrackerController } from './api/tracker';

const env: string = process.env.NODE_ENV || 'development';
const port: string = process.env.PORT || config.port || '4443';
const hmrPort: string = process.env.HMR_PORT || config.hmrPort || '7443';

async function createServer(root = process.cwd()) {
  const resolve = (p: string) => path.resolve(root, p);
  const app: express.Application = express();
  // const apiRouter: express.Router = express.Router();

  const blog: BlogController = new BlogController();
  const trackr: TrackerController = new TrackerController();

  const corsOptions =
    env === 'production'
      ? { origin: `${config.protocol}://${config.host}` }
      : {};

  const hmrOptions =
    env === 'development'
      ? { connectSrc: ["'self'", `ws://localhost:${hmrPort}`] }
      : {};

  const helmetConfig = {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: [
          "'self'",
          () => `'sha256-5+YTmTcBwCYdJ8Jetbr6kyjGp0Ry/H7ptpoun6CrSwQ='`,
        ],
        ...hmrOptions,
      },
    },
  };

  app.use(helmet(helmetConfig));
  app.use(cors(corsOptions));

  app.get('/api/blog', blog.getPosts);
  app.get('/api/track/token', trackr.getToken);
  app.get('/api/track/analytic', trackr.get);
  app.post('/api/track', trackr.save);

  if (env === 'production') {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      }),
    );
    app.use('*', ssrMiddleware({}));
  } else {
    const viteServerConfig: UserConfig = {
      base: resolve('src/client/'),
      root: resolve('src/client'),
      appType: 'custom',
      server: {
        middlewareMode: true,
        port: Number(port),
        hmr: {
          protocol: 'ws',
          port: Number(hmrPort),
        },
      },
    };
    const vite = await (
      await import('vite')
    ).createServer((<unknown>viteServerConfig) as UserConfig);
    app.use(vite.middlewares);
    app.use('*', ssrMiddleware({ vite }));
  }

  return { app };
}

createServer().then(({ app }) => {
  const port: string = process.env.PORT || config.port || '4443';
  app.listen(port, (): void => {
    const addr = `${
      config.protocol === 'HTTPS' ? 'https' : 'http'
    }://localhost:${port}`;
    process.stdout.write(
      `\n [${new Date().toISOString()}] ${chalk.green(
        'Server running:',
      )} ${chalk.blue(addr)} \n`,
    );
  });
});
