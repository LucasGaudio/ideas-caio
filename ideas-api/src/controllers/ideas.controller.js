import * as ideasService from '../services/ideas.service.js';

export const createIdea = async (req, res) => {
  try {
    const idea = await ideasService.createIdea(req.body);
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await ideasService.getAllIdeas();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const idea = await ideasService.getIdeaById(req.params.id);

    if (!idea) {
      return res.status(404).json({ error: 'Ideia não encontrada' });
    }

    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const updated = await ideasService.updateIdea(
      req.params.id,
      req.body
    );

    res.json(updated);
  } catch (error) {
    if (error.message === 'IDEA_NOT_FOUND') {
      return res.status(404).json({ error: 'Ideia não encontrada' });
    }

    if (error.message === 'IDEA_LOCKED') {
      return res.status(409).json({ error: 'Ideia já classificada' });
    }

    res.status(500).json({ error: error.message });
  }
};

export const classifyIdea = async (req, res) => {
  try {
    const result = await ideasService.classifyIdea(
      req.params.id,
      req.body
    );

    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'IDEA_NOT_FOUND') {
      return res.status(404).json({ error: 'Ideia não encontrada' });
    }

    if (error.message === 'IDEA_ALREADY_CLASSIFIED') {
      return res.status(409).json({ error: 'Ideia já classificada' });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getClassification = async (req, res) => {
  try {
    const classification = await ideasService.getClassification(
      req.params.id
    );

    if (!classification) {
      return res.status(404).json({
        error: 'Classificação não encontrada'
      });
    }

    res.json(classification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};