import loki from 'lokijs';
import fetch from 'node-fetch';
import { config } from './config';

const db = new loki('dist/DB', {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000
});
const posts = db.addCollection('posts', { indices: ['id'] });

function init() {
    return fetch('https://dev.to/api/articles?username=steveblue', {
        method: 'get',
        headers: { 'Content-Type': 'application/json',
                   'api-key': config.devApiKey
                  }
    })
    .then(res => res.json())
    .then(json => {
        json.forEach(post => posts.insert(post));
    });
}


export { db, init, posts };