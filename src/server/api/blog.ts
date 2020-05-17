import { IRoute } from 'express';
import { join } from 'path';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(join(process.cwd(), 'dist', 'db.json'));
const db = low(adapter);

class BlogController implements IRoute {
    constructor() {}
    getPosts(req, res) {
        const data = db.get('posts').orderBy('created_at', 'desc').value();
        res.status(200).send(data);
    }
}

export { BlogController };