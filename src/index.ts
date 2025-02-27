require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import queryRoutes from './routes/query.routes';
import logger from './config/winston';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', queryRoutes);

AppDataSource.initialize()
  .then(async () => {
    logger.info('Conectado com sucesso ao banco de dados');
  })
  .catch(() => logger.error('Erro ao conectar ao banco de dados'));

app.listen(3333, () => {
  logger.info('Servidor rodando na porta 3333');
});
