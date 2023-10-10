import { Router } from 'express';
import { storyCtrl } from '../controllers/storyCtrl';

export const router = Router();

router.get('/story/data/:id', storyCtrl.getStoryData);
router.get('/story/content/:id', storyCtrl.getStoryContent);