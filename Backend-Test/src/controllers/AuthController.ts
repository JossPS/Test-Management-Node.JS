import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const result = await authService.register(name, email, password);

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Error al registrar usuario',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || 'Credenciales inválidas',
      });
    }
  }
}