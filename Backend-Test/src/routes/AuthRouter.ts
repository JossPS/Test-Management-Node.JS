import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { loginValidation, registerValidation } from '../middlewares/Validation';

const router = Router();
const controller = new AuthController();

router.post('/register', registerValidation, controller.register.bind(controller));
router.post('/login', loginValidation, controller.login.bind(controller));

export default router;