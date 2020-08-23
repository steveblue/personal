import express from 'express';

import { BlogController } from './../api/blog';
import { TrackerController } from './../api/tracker';


const apiRouter: express.Router = express.Router();
const blog: BlogController = new BlogController();
const trackr: TrackerController = new TrackerController();

apiRouter.get('/blog', blog.getPosts);
apiRouter.get('/track/token', trackr.getToken);

export default apiRouter;