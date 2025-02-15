import { IRoute } from 'express';
import { join } from 'path';

// import { Low } from 'lowdb';
// import { JSONFileSync } from 'lowdb/node';
import { readFileSync } from 'fs';

// const adapter = new JSONFileSync(join(process.cwd(), 'dist', 'db.json'));
// const db = new Low(adapter);

class BlogController implements Partial<IRoute> {
  constructor() {
    // db.data ||= { posts: [] };
    // db.write();
  }
  getPosts(req, res) {
    const db = readFileSync(join(process.cwd(), 'dist', 'db.json'), 'utf-8');
    const data = [...JSON.parse(db).posts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    res.status(200).send(data);
  }
}

export { BlogController };
