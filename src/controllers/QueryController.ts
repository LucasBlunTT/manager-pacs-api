import { Request, Response } from 'express';
import QueryService from '../services/QueryService';
import { start } from 'repl';

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
}

export default QueryController;
