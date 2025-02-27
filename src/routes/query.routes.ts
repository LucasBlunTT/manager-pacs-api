import { Router } from 'express';
const queryRoutes = Router();
import QueryController from '../controllers/queryController';

const queryController = new QueryController();

queryRoutes.post('/volumetric-report', queryController.getVolumetricReport);

export default queryRoutes;
