import { Router } from 'express';
const queryRoutes = Router();
import QueryController from '../controllers/QueryController';

const queryController = new QueryController();

queryRoutes.post('/volumetric-report', queryController.getVolumetricReport);
queryRoutes.post('/reset-exam-record', queryController.resetExamRecord);

export default queryRoutes;
