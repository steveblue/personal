
import { IRoute } from 'express';
import { db } from './../init';

class BlogController implements IRoute {
    constructor() {

    }
    getPosts(req, res) {
        res.status(200).send(db.getCollection('posts').data)
    }
}

export { BlogController };