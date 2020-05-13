import loki from 'lokijs';
import fetch from 'node-fetch';
import { config } from './config';


const db = new loki('dist/DB', {
    autoload: true,
    autoloadCallback : databaseInitialize,
    autosave: true,
    autosaveInterval: 5000
});


function databaseInitialize() {
  let posts = db.getCollection('posts');
  if (posts === null) {
    posts = db.addCollection('posts');
  }
  init(posts);
}

function init(posts) {
  return fetch('https://dev.to/api/articles?username=steveblue', {
      method: 'get',
      headers: { 'Content-Type': 'application/json',
                  'api-key': config.devApiKey
                }
  })
  .then(res => res.json())
  .then(json => {
      json.forEach(article => {
        if (!posts.findOne({'id': article.id})) {
          console.log('adding:', JSON.parse(JSON.stringify(article, null, 4)));
          posts.insert(article);
        }
      });
  });
}

databaseInitialize();

export { db, init };