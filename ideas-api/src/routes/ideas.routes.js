import express from 'express';
import { createIdea, getAllIdeas, getIdeaById, updateIdea, classifyIdea, getClassification } from '../controllers/ideas.controller.js';

const router = express.Router();

router.post('/', createIdea);

router.get('/', getAllIdeas);

router.get('/:id', getIdeaById);

router.put('/:id', updateIdea);

router.post('/:id/classification', classifyIdea);

router.get('/:id/classification', getClassification);

export default router;