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
      const { accessionNumber } = req.body;
      await QueryService.resetExamRecord(accessionNumber);
      res.status(200).json({ message: 'Registro resetado com sucesso' });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Erro ao resetar registro', error: error.message });
    }
  }
}

export default QueryController;
