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
      WHERE dicomstudies.studydate BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY dicomstudies.studymodal
      ORDER BY 3 DESC;
    `;

    const result = await AppDataSource.query(volumetricReportQuery);
    return result;
  }

  async getVolumetricReportByDate(startDate: string, endDate: string): Promise<any> {
    const volumetricReportQuery = `
      SELECT TO_CHAR(CAST(dicomstudies.studydate AS DATE), 'YYYY-MM') AS "Mês",
       dicomstudies.studymodal AS "Modalidade",
       COUNT(DISTINCT dicomstudies.studyinsta) AS "Estudos",
       ROUND(SUM(dicomimages.nu_filesize)/1024/1024/1024, 1) AS "Tamanho (GB)"
      FROM dicomstudies
      INNER JOIN dicomseries ON dicomstudies.studyinsta = dicomseries.studyinsta
      INNER JOIN dicomimages ON dicomseries.seriesinst = dicomimages.seriesinst
      WHERE CAST(dicomstudies.studydate AS DATE) BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY TO_CHAR(CAST(dicomstudies.studydate AS DATE), 'YYYY-MM'), dicomstudies.studymodal
      ORDER BY "Mês" ASC, "Tamanho (GB)" DESC;
    `;

    const result = await AppDataSource.query(volumetricReportQuery);
    console.log(result);
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
        .update("dicomstudies")
        .set({ nu_numrecordplaines: 0, nu_numrecords: 0 })
        .where("accessionn = :accessionNumber", { accessionNumber })
        .execute();
    } else if (startDate && endDate) {
      updateResult = await AppDataSource.createQueryBuilder()
        .update("dicomstudies")
        .set({ nu_numrecordplaines: 0, nu_numrecords: 0 })
        .where("studydate BETWEEN :startDate AND :endDate", { startDate, endDate })
        .execute();
    } else {
      throw new Error("Parâmetros inválidos para resetar registros");
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
    
    return { drives, rawResult: result, space };
  }
  }
  
export default new QueryService();
