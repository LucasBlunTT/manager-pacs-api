require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import { AppDataSourceSqlite } from './database/data-source-sqlite';
import logger from './config/winston';
import queryRoutes from './routes/query.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', queryRoutes);

AppDataSource.initialize()
  .then(() => {
    logger.info('Conectado com sucesso ao banco de dados PostgreSQL');
  })
  .catch(() => logger.error('Erro ao conectar ao banco de dados PostgreSQL'));

AppDataSourceSqlite.initialize()
  .then(async () => {
    logger.info('Conectado com sucesso ao banco de dados SQLite');
    await AppDataSourceSqlite.runMigrations();
  })
  .catch((error) => logger.error('Erro ao conectar ao banco de dados SQLite', error));

app.listen(3333, '0.0.0.0', () => {
  logger.info('Servidor rodando na porta 3333');
});
