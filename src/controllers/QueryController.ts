import { Request, Response } from 'express';
import QueryService from '../services/QueryService';

class QueryController {

  async getVolumetricReportByDate(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.body;
      console.log('Start Date:', startDate, 'End Date:', endDate);

      const data = await QueryService.getVolumetricReportByDate(startDate, endDate);

      res.status(200).json(data);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({
        message: 'Erro ao buscar dados',
        error: error.message,
      });
    }
  }

  async getVolumetricReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.body;
      const formattedStartDate = startDate.replace(/-/g, '');
      const formattedEndDate = endDate.replace(/-/g, '');

      const data = await QueryService.getVolumetricReport(formattedStartDate, formattedEndDate);
      res.status(200).json(data);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({
        message: 'Erro ao buscar dados',
        error: error.message,
      });
    }
  }

  async resetExamRecord(req: Request, res: Response): Promise<void> {
    try {
      const { accessionNumber, startDate, endDate } = req.body;
      
      let result;
      if (accessionNumber) {
        result = await QueryService.resetExamRecord(accessionNumber);
      } else if (startDate && endDate) {
        result = await QueryService.resetExamRecord(
          undefined,
          startDate,
          endDate
        );
      } else {
        res.status(400).json({ message: 'Parâmetros inválidos' });
        return;
      }

      res.status(200).json({
        message: 'Registros resetados com sucesso',
        affectedRows: result.affectedRows,
      });
    } catch (error: any) {
      console.error('Erro ao resetar registro:', error);
      res.status(500).json({
        message: 'Erro ao resetar registro',
        error: error.message,
      });
    }
  }

  async getDisckActive(req: Request, res: Response): Promise<void> {
    try {    
      const diskActive = await QueryService.getDisckActive();
      const {space, rawResult} = diskActive;

      if (!space) {
        res.status(500).json({ message: 'Erro ao verificar espaço em disco' });
        return;
      }
      const { total, free } = space;
      res.status(200).json({ total, free, rawResult});  
    } catch (error: any) {
      console.error('Erro ao verificar espaço em disco:', error);
      res.status(500).json({
        message: 'Erro ao verificar espaço em disco',
        error: error.message,
      });
    }
  }

}

export default QueryController;
