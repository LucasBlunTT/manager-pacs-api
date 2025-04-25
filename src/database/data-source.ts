import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { readDataSourceConfig } from '../util/readXML';

enum DatabaseType {
  POSTGRES = 'postgres',
  ORACLE = 'oracle',
  MSSQL = 'mssql',
}

function getDatabaseType(driverClass: string | undefined): DatabaseType {
  if (!driverClass) {
    throw new Error('Driver class não definido');
  }

  if (driverClass.includes('postgresql')) {
    return DatabaseType.POSTGRES;
  } else if (driverClass.includes('oracle')) {
    return DatabaseType.ORACLE;
  } else {
    return DatabaseType.MSSQL;
  }
}

const dataSourceConfig = readDataSourceConfig(path.join(__dirname, '../config/otodata-ds.xml'));

if (!dataSourceConfig) {
  throw new Error('Não foi possível carregar a configuração do datasource');
}

const typeDbc = getDatabaseType(dataSourceConfig.driverClass);
const [host, port] = dataSourceConfig.connectionUrl.split('/')[2].split(':');
const database = dataSourceConfig.connectionUrl.split('/')[3];

export const AppDataSource = new DataSource({
  type: typeDbc,
  host,
  port: parseInt(port, 10),
  username: dataSourceConfig.userName,
  password: dataSourceConfig.password,
  database,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
});

