import fs from 'fs';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { readDataSourceConfig } from '../util/readXML';
import { inferOrmTypeFromJdbc, parseJdbc } from '../util/jdbc';

// Pega o caminho do XML
const otodataDir = path.join(__dirname, './otodata');

const xmlFile = fs.readdirSync(otodataDir).find((f: string) => f.endsWith('.xml'));
if (!xmlFile) throw new Error('Nenhum arquivo .xml foi encontrado na pasta otodata');

const otodataPath = path.join(otodataDir, xmlFile);

// Agora espera que readDataSourceConfig também retorne driverClass (se possível)
const dataSourceConfig = readDataSourceConfig(otodataPath);

if (!dataSourceConfig?.connectionUrl) {
  throw new Error('Não foi possível carregar a configuração do datasource');
}

const ormType = inferOrmTypeFromJdbc(
  dataSourceConfig.connectionUrl,
  dataSourceConfig.driverClass
);

const { host, port, database } = parseJdbc(dataSourceConfig.connectionUrl);

export const AppDataSource = new DataSource({
  type: ormType,                  
  host,
  port,
  username: dataSourceConfig.userName,
  password: dataSourceConfig.password,
  database,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
});
