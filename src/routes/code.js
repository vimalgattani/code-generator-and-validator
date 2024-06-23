import express from 'express';
import { initiate, validate } from '../controllers/code.js';
const router = express.Router();

router.post('/generate', initiate);
router.post('/validate', validate);

export {router as codeRoutes}