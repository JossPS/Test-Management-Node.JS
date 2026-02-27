import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async updateMe(userId: string, name: string) {
    const user = await userRepository.updateName(userId, name);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      message: 'Perfil actualizado',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAllUsers() {
    const users = await userRepository.findAll();

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    };
  }
}