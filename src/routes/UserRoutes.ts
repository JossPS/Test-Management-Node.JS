import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorizeAdmin } from '../middlewares/AuthMiddleware';
import { updateProfileValidation } from '../middlewares/Validation';

const router = Router();
const controller = new UserController();

router.get('/me', authenticate, controller.me.bind(controller));
router.put('/me', authenticate, updateProfileValidation, controller.updateMe.bind(controller));
router.get('/', authenticate, authorizeAdmin, controller.getAll.bind(controller));

export default router;