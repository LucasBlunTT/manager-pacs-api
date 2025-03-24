import { query, Router } from 'express';
const queryRoutes = Router();
import QueryController from '../controllers/QueryController';

const queryController = new QueryController();

queryRoutes.post('/volumetric-report', queryController.getVolumetricReport);
queryRoutes.post('/reset-exam-record', queryController.resetExamRecord);
queryRoutes.post('/volumetric-report-by-date', queryController.getVolumetricReportByDate);
queryRoutes.get('/disco-ativo', queryController.getDisckActive);

export default queryRoutes;
