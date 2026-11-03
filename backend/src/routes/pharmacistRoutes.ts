import { Router } from 'express';
import * as pharmacistController from '../controllers/pharmacistController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

// Protect all pharmacist routes with auth
router.use(authMiddleware);

// Visit related
router.get('/visit/search', requireRole(['admin']), pharmacistController.getVisitByToken);
router.get('/visit/search-optimized', requireRole(['admin']), pharmacistController.getOptimizedVisitByToken);
router.post('/give-medicine', requireRole(['admin']), pharmacistController.giveMedicines);

// Medicine management
router.get('/medicines', requireRole(['admin']), pharmacistController.getMedicines);
router.get('/medicines/names', requireRole(['admin']), pharmacistController.getMedicineNames);
router.get('/medicine/:id', requireRole(['admin']), pharmacistController.getMedicineById);
router.get('/medicines/detail', requireRole(['admin']), pharmacistController.getMedicineByExactName);
router.post('/medicines', requireRole(['admin']), pharmacistController.addMedicine);
router.post('/medicines/bulk', requireRole(['admin']), pharmacistController.bulkCreateMedicines);
router.put('/medicines/bulk', requireRole(['admin']), pharmacistController.bulkUpdateMedicines);
router.put('/medicines/:id', requireRole(['admin']), pharmacistController.updateMedicine);

export default router;
