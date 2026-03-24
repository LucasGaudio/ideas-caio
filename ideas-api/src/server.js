import express from 'express';
import cors from 'cors';
import ideasRoutes from './routes/ideas.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/ideas', ideasRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});