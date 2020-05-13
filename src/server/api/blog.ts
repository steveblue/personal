
import { IRoute } from 'express';
import { db } from './../init';

function sortByDate(a,b){
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime() ? 1 : -1;
}

class BlogController implements IRoute {
    constructor() {

    }
    getPosts(req, res) {
        const data = db.getCollection('posts').data.sort(sortByDate);
        res.status(200).send(data);
    }
}

export { BlogController };