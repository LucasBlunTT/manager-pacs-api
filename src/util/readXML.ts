import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

interface DataSourceConfig {
  connectionUrl: string;
  userName: string;
  password: string;
  driverClass: string;
}

export const readDataSourceConfig = (
  filePath: string
): DataSourceConfig | null => {
  try {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const jsonObj = parser.parse(xmlData);

    const dataSource = jsonObj.datasources['local-tx-datasource'];
    return {
      connectionUrl: dataSource['connection-url'],
      userName: dataSource['user-name'],
      password: dataSource['password'],
      driverClass: dataSource['driver-class'],
    };
  } catch (error) {
    console.error('Erro ao ler o arquivo XML:', error);
    return null;
  }
};
