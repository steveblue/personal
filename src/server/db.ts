import fetch from 'node-fetch';
import { config } from './config';
import { join } from 'path';

import { Low } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

const adapter = new JSONFileSync(join('db.json'));
const db = new Low(adapter);

const analyticsAdapter = new JSONFileSync(join('analytic.json'));
const analytics = new Low(analyticsAdapter);

function databaseInitialize() {
  db.data ||= { posts: [] };
  db.write();
  init(db.data.posts);
}

function analyticsInitialize() {
  analytics.data ||= { stats: [] };
  analytics.write();
}

function serialize(article) {
  article.created_at = new Date(article.created_at).getTime();
  return article;
}

function init(coll) {
  return fetch('https://dev.to/api/articles?username=steveblue', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.token.dev,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      db.data.posts = json;
      db.write();
    });
}

databaseInitialize();
analyticsInitialize();

export { db, init, databaseInitialize };
