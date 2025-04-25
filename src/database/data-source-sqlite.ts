import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';

export const AppDataSourceSqlite = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../database/radiologyDB/radiologyDB.db'),
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [path.join(__dirname, '../entities/sqlite/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/sqlite/*.{ts,js}')],
});