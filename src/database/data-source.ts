import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import fs from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';
import dotenv from 'dotenv';

dotenv.config();

// Caminho do arquivo XML
const xmlFilePath = 'C:\\pixeon\\PACS\\current\\aurora\\server\\local\\deploy\\otodata-ds.xml';

// Função para extrair os dados do XML
async function getDatabaseConfig() {
  try {
    const xmlData = await fs.readFile(xmlFilePath, 'utf-8');
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonData = parser.parse(xmlData);

    const datasource = jsonData.datasources["local-tx-datasource"];
    if (!datasource) throw new Error("Arquivo XML não contém configuração de datasource válida.");

    const connectionUrl = datasource["connection-url"];
    const username = datasource["user-name"];
    const password = datasource["password"];

    // Extraindo host, porta e database da URL JDBC
    const match = connectionUrl.match(/jdbc:postgresql:\/\/(.*?):(\d+)\/(.*)/);
    if (!match) throw new Error("Formato da URL JDBC inválido.");

    const [, host, port, database] = match;

    return { host, port: parseInt(port, 10), username, password, database };
  } catch (error) {
    console.error("Erro ao ler configuração do banco:", error);
    throw error;
  }
}

// Criando o DataSource de forma assíncrona
export const AppDataSource = (async () => {
  const config = await getDatabaseConfig();

  return new DataSource({
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [path.join(__dirname, '../entities/*.{ts,js}')],
    migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
  });
})();
