import { IRoute } from 'express';
import { join } from 'path';
import { config } from '../../config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(join(process.cwd(), 'dist', 'db.json'));
const db = low(adapter);

class TrackerController implements IRoute {
    constructor() {}
    getToken(req, res) {
        res.status(200).send({ token: config.token.ipinfo });
    }
}

export { TrackerController };