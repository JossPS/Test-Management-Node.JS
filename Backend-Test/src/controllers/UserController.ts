import { Response } from 'express';
import { validationResult } from 'express-validator';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middlewares/AuthMiddleware';

const userService = new UserService();

export class UserController {
  async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      const user = await userService.getMe(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || 'Usuario no encontrado',
      });
    }
  }

  async updateMe(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      const { name } = req.body;

      const result = await userService.updateMe(userId, name);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Error al actualizar perfil',
      });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const result = await userService.getAllUsers();
      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}