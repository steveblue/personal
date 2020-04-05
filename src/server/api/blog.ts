
import { IRoute } from 'express';
import fetch from 'node-fetch';

import { config } from './../config';

class BlogController implements IRoute {
    constructor() {

    }
    getPosts(req, res) {
        fetch('https://dev.to/api/articles?username=steveblue', {
            method: 'get',
            headers: { 'Content-Type': 'application/json',
                       'api-key': config.devApiKey
                      }
        })
        .then(res => res.json())
        .then(json => res.status(200).send(json));
    }
}

export { BlogController };