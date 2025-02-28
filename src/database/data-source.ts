import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { readDataSourceConfig } from '../util/readXML';

const dataSourceConfig = readDataSourceConfig('C:/pixeon/PACS/current/aurora/server/local/deploy/otodata-ds.xml');

if (!dataSourceConfig) {
  throw new Error('Não foi possível carregar a configuração do datasource');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dataSourceConfig.connectionUrl.split('/')[2].split(':')[0],
  port: parseInt(dataSourceConfig.connectionUrl.split(':')[3].split('/')[0], 10),
  username: dataSourceConfig.userName,
  password: dataSourceConfig.password,
  database: dataSourceConfig.connectionUrl.split('/')[3],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
});