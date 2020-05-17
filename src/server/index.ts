import chalk from 'chalk';
import express from 'express';
import path from 'path';
import compression from 'compression';
import fs from 'fs';
import http from 'http';
import https from 'https';
import cors from 'cors';

import apiRouter from './middleware/router';
import errorHandler from './middleware/errorHandler';
import ssr from './middleware/ssr';

import { config } from './config';

const app: express.Application = express();
const env: string = process.env.NODE_ENV || 'development';
const port: string = process.env.PORT || '4444';
const protocol: string = process.env.PROTOCOL || 'HTTP';
const corsOptions = env === 'production' ? { origin : `${config.protocol}://${config.host}` } : {};
let server: http.Server | https.Server;

if (protocol === 'HTTPS') {
  const sslOptions = {
    key: fs.readFileSync(path.join(process.cwd(), '.config', 'ssl', 'key.pem')),
    cert: fs.readFileSync(
      path.join(process.cwd(), '.config', 'ssl', 'cert.pem')
    ),
    requestCert: false,
    rejectUnauthorized: false
  };
  server = https.createServer(sslOptions, app);
} else {
  server = http.createServer(app);
}

app.use(cors(corsOptions));
app.use(errorHandler);

const staticOptions = {
  dotfiles: 'ignore',
  extensions: ['htm', 'html'],
  index: false,
  redirect: false
}

if (env === 'production') {
  app.use(compression());
  app.use(express.static(path.resolve(process.cwd(), 'dist', 'client'), staticOptions));
  app.use(express.static(path.resolve(process.cwd(), 'dist',  'client', 'asset')));
  // commented out code enables non ssr server
  // app.get("/*", (req, res) => {
  //   res.sendFile(path.resolve(process.cwd(), "dist", "client", "index.html"));
  // });
  app.get('/', ssr);
  app.get('/blog', ssr);
  app.get('/resume', ssr);
  app.get('/cv', ssr);
}

app.use('/api', apiRouter);

server.listen(port, (): void => {
  const addr = `${protocol === 'HTTPS' ? 'https' : 'http'}://localhost:${port}`;
  process.stdout.write(
    `\n [${new Date().toISOString()}] ${chalk.green(
      'Server running:'
    )} ${chalk.blue(addr)} \n`
  );
});

export default app;
