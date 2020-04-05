import express from 'express';

import { BlogController } from './../api/blog';

const apiRouter: express.Router = express.Router();
const blog: BlogController = new BlogController();

apiRouter.get('/blog', blog.getPosts);

export default apiRouter;