import { Request, Response } from 'express';
import QueryService from '../services/QueryService';

class QueryController {
  async getVolumetricReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.body;
      console.log(startDate, endDate);
      const data = await QueryService.getVolumetricReport(startDate, endDate);
      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Erro ao buscar dados', error: error.message });
    }
  }

  async resetExamRecord(req: Request, res: Response): Promise<void> {
    try {
      const { accessionNumber, startDate, endDate } = req.body;
      console.log(accessionNumber + ' aqui');
      console.log(startDate + ' aqui');
      console.log(endDate + ' aqui');
      if (accessionNumber) {
        await QueryService.resetExamRecord(accessionNumber);
      } else if (startDate && endDate) {
        await QueryService.resetExamRecord(undefined, startDate, endDate);
      } else {
        res.status(400).json({ message: 'Parâmetros inválidos' });
        return;
      }
      res.status(200).json({ message: 'Registros resetados com sucesso' });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Erro ao resetar registro', error: error.message });
    }
  }
}

export default QueryController;
