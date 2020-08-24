import { IRoute } from 'express';
import { join } from 'path';
import { config } from '../../config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(join(process.cwd(), 'dist', 'analytic.json'));
const db = low(adapter);

class TrackerController implements IRoute {
    constructor() {}
    getToken(req, res) {
        res.status(200).send({ token: config.token.ipinfo });
    }
    get(req, res) {
        const data = db.get('stats').orderBy('timestamp', 'desc').value();
        res.status(200).send(data);
    }
    save(req, res) {
        db.get('stats').push(req.body).write();
        res.status(200).send(req.body);
    }
}

export { TrackerController };