import express from 'express';
import { addWebsite, checkWebsiteStatus, getWebsiteLogs, deleteUrl, editUrl, getWebsiteUrls } from '../controllers/website.controller.js';

const router = express.Router();

router.post('/', addWebsite);
router.get('/status', checkWebsiteStatus); 
router.get('/:id/logs', getWebsiteLogs);
router.get('/:id/urls', getWebsiteUrls);
router.delete('/delete/:id', deleteUrl);
router.put('/edit/:id', editUrl);

export default router;
