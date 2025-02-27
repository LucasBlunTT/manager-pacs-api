import { AppDataSource } from '../database/data-source';
class QueryService {
  async getVolumetricReport(startDate: string, endDate: string): Promise<any> {
    const volumetricReportQuery = `
      SELECT DISTINCT(dicomstudies.studymodal) AS "Modalidade",
             COUNT(DISTINCT(dicomstudies.studyinsta)) AS "Estudos",
             ROUND(SUM(dicomimages.nu_filesize)/1024/1024/1024,1) AS "Tamanho (GB)"
      FROM dicomstudies
      INNER JOIN dicomseries ON dicomstudies.studyinsta = dicomseries.studyinsta
      INNER JOIN dicomimages ON dicomseries.seriesinst = dicomimages.seriesinst
      WHERE dicomstudies.studydate BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY dicomstudies.studymodal
      ORDER BY 3 DESC;
    `;

    const result = await AppDataSource.query(volumetricReportQuery);
    return result;
  }

  async resetExamRecord(
    accessionNumber?: string,
    startDate?: string,
    endDate?: string
  ): Promise<void> {
    if (accessionNumber) {
      const resetExamRecordQuery = `
      UPDATE dicomstudies
      SET nu_numrecordplaines = 0, nu_numrecords = 0
      WHERE accessionn = '${accessionNumber}';
    `;
      await AppDataSource.query(resetExamRecordQuery);
    } else {
      const resetExamRecordQuery = `
      UPDATE dicomstudies
      SET nu_numrecordplaines = 0, nu_numrecords = 0
      WHERE studydate BETWEEN '${startDate}' AND '${endDate}';
    `;
      await AppDataSource.query(resetExamRecordQuery);
    }
  }
}

export default new QueryService();
