import loki from 'lokijs';
import chalk from 'chalk';
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
if (process.argv.includes('--update')) {
    init().then(() => {
        process.stdout.write(
          `\n [${new Date().toISOString()}] ${chalk.green(
            'import complete'
          )}\n`
        );
        process.exit(0);
      });;
}
export { db, init, posts };