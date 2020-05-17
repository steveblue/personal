import fetch from 'node-fetch';
import { config } from './config';
import { join } from 'path';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(join('db.json'));
const db = low(adapter);

function databaseInitialize() {
  db.defaults({ posts: [] }).write();
  init(db.get('posts'));
}

function serialize(article) {
  article.created_at = new Date(article.created_at).getTime();
  return article;
}

function init(coll) {
  return fetch('https://dev.to/api/articles?username=steveblue', {
      method: 'get',
      headers: { 'Content-Type': 'application/json',
                  'api-key': config.devApiKey
                }
  })
  .then(res => res.json())
  .then(json => {
      json.forEach(article => {
        article = serialize(article);
        if ( coll.find({id: article.id}).value() ) {
          console.log(`updating ${article.id}`);
          coll.find({id: article.id}).assign(article).write();
        } else {
          console.log(`adding ${article.id}`);
          coll.push(article).write();
        }
      });
  });
}

databaseInitialize();

export { db, init, databaseInitialize };