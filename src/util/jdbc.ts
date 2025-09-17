type OrmDbType =
  | 'postgres'
  | 'mysql'
  | 'mariadb'
  | 'mssql'
  | 'oracle'
  | 'cockroachdb';

export function inferOrmTypeFromJdbc(url: string, driverClass?: string): OrmDbType {
  // 1) Se tiver driver-class, prioriza (mais confiável)
  if (driverClass) {
    if (/postgresql/i.test(driverClass)) return 'postgres';
    if (/mysql/i.test(driverClass)) return 'mysql';
    if (/mariadb/i.test(driverClass)) return 'mariadb';
    if (/sqlserver|mssql/i.test(driverClass)) return 'mssql';
    if (/oracle/i.test(driverClass)) return 'oracle';
    if (/cockroach/i.test(driverClass)) return 'cockroachdb';
  }

  // 2) Senão, usa o prefixo da JDBC URL
  if (/^jdbc:postgresql:/i.test(url)) return 'postgres';
  if (/^jdbc:mysql:/i.test(url)) return 'mysql';
  if (/^jdbc:mariadb:/i.test(url)) return 'mariadb';
  if (/^jdbc:sqlserver:/i.test(url)) return 'mssql';
  if (/^jdbc:oracle:/i.test(url)) return 'oracle';
  if (/^jdbc:cockroach:/i.test(url)) return 'cockroachdb';

  throw new Error(`Não foi possível inferir o tipo do banco a partir da URL: ${url}`);
}

export function parseJdbc(url: string): { host: string; port?: number; database?: string } {
  // Postgres/MySQL/MariaDB/Cockroach: jdbc:postgresql://host:port/db?...
  const simple = /^jdbc:(postgresql|mysql|mariadb|cockroach):\/\/([^/:?#]+)(?::(\d+))?\/([^?;#]+)/i;
  const m1 = url.match(simple);
  if (m1) {
    const port = m1[3] ? parseInt(m1[3], 10) : undefined;
    return { host: m1[2], port, database: m1[4] };
  }

  // SQL Server: jdbc:sqlserver://host:port;databaseName=DB;...
  const mssql = /^jdbc:sqlserver:\/\/([^;:?#]+)(?::(\d+))?(?:;.*?\bdatabaseName=([^;]+))?/i;
  const m2 = url.match(mssql);
  if (m2) {
    const port = m2[2] ? parseInt(m2[2], 10) : undefined;
    return { host: m2[1], port, database: m2[3] };
  }

  // Oracle (thin): jdbc:oracle:thin:@//host:port/serviceName  OU  jdbc:oracle:thin:@host:port:SID
  const oracle1 = /^jdbc:oracle:thin:@\/\/([^/:?#]+)(?::(\d+))?\/([^?;#]+)/i; // service name
  const oracle2 = /^jdbc:oracle:thin:@([^/:?#]+):(\d+):([^?;#]+)/i;           // SID
  const m3 = url.match(oracle1) || url.match(oracle2);
  if (m3) {
    const host = m3[1];
    const port = m3[2] ? parseInt(m3[2], 10) : undefined;
    const database = m3[3];
    return { host, port, database };
  }

  // Fallback: tenta extrair pelo menos o host
  throw new Error(`Formato JDBC não suportado: ${url}`);
}
