import { AppDataSource } from '../database/data-source';
import { verifyStorageSpace } from '../util/verifyStorageSpace';

class QueryService {
  async getVolumetricReport(startDate: string, endDate: string): Promise<any> {
    const volumetricReportQuery = `
      SELECT DISTINCT(dicomstudies.studymodal) AS "Modalidade",
             COUNT(DISTINCT(dicomstudies.studyinsta)) AS "Estudos",
             ROUND(SUM(dicomimages.nu_filesize)/1024/1024/1024,1) AS "Tamanho (GB)"
      FROM dicomstudies
      INNER JOIN dicomseries ON dicomstudies.studyinsta = dicomseries.studyinsta
      INNER JOIN dicomimages ON dicomseries.seriesinst = dicomimages.seriesinst
      WHERE dicomstudies.studydate BETWEEN $1 AND $2
      GROUP BY dicomstudies.studymodal
      ORDER BY 3 DESC;
    `;

    const result = await AppDataSource.query(volumetricReportQuery, [startDate, endDate]);
    return result;
  }

  async getVolumetricReportByDate(startDate: string, endDate: string): Promise<any> {
    const volumetricReportQuery = `
      SELECT DISTINCT(dicomstudies.studymodal) AS "Modalidade",
             COUNT(DISTINCT(dicomstudies.studyinsta)) AS "Estudos",
             ROUND(SUM(dicomimages.nu_filesize)/1024/1024/1024,1) AS "Tamanho (GB)"
      FROM dicomstudies
      INNER JOIN dicomseries ON dicomstudies.studyinsta = dicomseries.studyinsta
      INNER JOIN dicomimages ON dicomseries.seriesinst = dicomimages.seriesinst
      WHERE dicomstudies.studydate BETWEEN $1 AND $2
      GROUP BY dicomstudies.studymodal
      ORDER BY 3 DESC;
    `;

    const result = await AppDataSource.query(volumetricReportQuery, [startDate, endDate]);
    return result;
  }

  async resetExamRecord(
    accessionNumber?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ affectedRows: number }> {
    let updateResult;

    if (accessionNumber) {
      updateResult = await AppDataSource.createQueryBuilder()
        .update('dicomstudies')
        .set({ nu_numrecordplaines: 0, nu_numrecords: 0 })
        .where('accessionn = :accessionNumber', { accessionNumber })
        .execute();
    } else if (startDate && endDate) {
      updateResult = await AppDataSource.createQueryBuilder()
        .update('dicomstudies')
        .set({ nu_numrecordplaines: 0, nu_numrecords: 0 })
        .where('studydate BETWEEN :startDate AND :endDate', { startDate, endDate })
        .execute();
    } else {
      throw new Error('Parâmetros inválidos para resetar registros');
    }

    return { affectedRows: updateResult.affected ?? 0 };
  }

  async getDisckActive(): Promise<{ drives: string[], rawResult: { no_localstore: string }[], space: { total: number; free: number } | null }> {
    const query = `
      SELECT no_localstore 
      FROM devicestore 
      WHERE in_current = 'true';
    `;
  
    const result: { no_localstore: string }[] = await AppDataSource.query(query);
    const drives = result.map(({ no_localstore }) => no_localstore.match(/^[A-Z]:\//)?.[0] || '');
    const space = await verifyStorageSpace(drives[0]);

    console.log('Discos:', space);
    
    return { drives, rawResult: result, space };
  }

  async getMonitoramentoWorklist(): Promise<any[]> {
    const query = `
      SELECT
      wi.na_accessionnumber,
      wi.co_patientid,
      wi.na_patientname,
      wi.na_description,
      w.no_modalityris,
      wi.na_datetimeintegrated,
      wi.na_studydate,
      w.FL_STUDYRECEIVED
      FROM worklistintegration wi
      INNER JOIN worklist w
      ON w.no_accessionnumber = wi.na_accessionnumber
      ORDER BY wi.co_worklistintegration DESC
      LIMIT 100;
    `;

    const resultWorklistIntegration: any[] = await AppDataSource.query(query);
    console.log(resultWorklistIntegration);
    return resultWorklistIntegration;
  }
}

export default new QueryService();