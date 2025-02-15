import { IRoute } from 'express';
import { join } from 'path';
import { config } from '../config.js';

const dbPath = join(process.cwd(), 'dist', 'db.json');

// import { Low } from 'lowdb';
// import { JSONFileSync } from 'lowdb/node';

// const adapter = new JSONFileSync(join(process.cwd(), 'dist', 'analytic.json'));
// const db = new Low(adapter);

import { readFileSync, writeFileSync } from 'fs';

class TrackerController implements IRoute {
  constructor() {
    // db.data ||= { stats: [] };
    // db.write();
  }
  getToken(req, res) {
    res.status(200).send({ token: config.token.ipinfo });
  }
  get(req, res) {
    const db = readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(db).stats.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    res.status(200).send(data);
  }
  save(req, res) {
    const db = readFileSync(dbPath, 'utf-8');
    const stats = JSON.parse(db).stats;
    stats.push(req.body);
    writeFileSync(JSON.stringify(stats), dbPath);
    res.status(200).send();
  }
}

export { TrackerController };
