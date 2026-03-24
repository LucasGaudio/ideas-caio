import { pool } from '../config/db.js';

export const createIdea = async (data) => {
  const {
    re_author,
    what_to_improve,
    current_process,
    proposed_solution,
    benefit
  } = data;

  const [result] = await pool.query(
    `INSERT INTO ideas 
    (re_author, what_to_improve, current_process, proposed_solution, benefit, created_at)
    VALUES (?, ?, ?, ?, ?, CURDATE())`,
    [re_author, what_to_improve, current_process, proposed_solution, benefit]
  );

  return { id: result.insertId, ...data };
};

export const getAllIdeas = async () => {
  const [rows] = await pool.query('SELECT * FROM ideas ORDER BY id DESC');
  return rows;
};

export const getIdeaById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ideas WHERE id = ?',
    [id]
  );

  return rows[0];
};

export const updateIdea = async (id, data) => {
  const {
    what_to_improve,
    current_process,
    proposed_solution,
    benefit
  } = data;

  const [rows] = await pool.query(
    'SELECT * FROM ideas WHERE id = ?',
    [id]
  );

  const idea = rows[0];

  if (!idea) {
    throw new Error('IDEA_NOT_FOUND');
  }

  if (idea.is_locked) {
    throw new Error('IDEA_LOCKED');
  }

  await pool.query(
    `UPDATE ideas SET
      what_to_improve = ?,
      current_process = ?,
      proposed_solution = ?,
      benefit = ?
    WHERE id = ?`,
    [
      what_to_improve,
      current_process,
      proposed_solution,
      benefit,
      id
    ]
  );

  return { id, ...data };
};

export const classifyIdea = async (id, data) => {
  const { result, re_responsible, final_comment } = data;

  const [ideas] = await pool.query(
    'SELECT * FROM ideas WHERE id = ?',
    [id]
  );

  const idea = ideas[0];

  if (!idea) {
    throw new Error('IDEA_NOT_FOUND');
  }

  if (idea.is_locked) {
    throw new Error('IDEA_ALREADY_CLASSIFIED');
  }

  await pool.query(
    `INSERT INTO classifications
    (idea_id, classification_date, result, re_responsible, final_comment)
    VALUES (?, CURDATE(), ?, ?, ?)`,
    [id, result, re_responsible, final_comment]
  );

  await pool.query(
    `UPDATE ideas
     SET status = ?, is_locked = true
     WHERE id = ?`,
    [result, id]
  );

  return {
    idea_id: id,
    result
  };
};

export const getClassification = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM classifications WHERE idea_id = ?',
    [id]
  );

  return rows[0];
};