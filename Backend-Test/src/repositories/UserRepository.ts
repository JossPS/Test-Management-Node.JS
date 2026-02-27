import { User } from '../models/User';
import { UserRole } from '../models/User';

export class UserRepository {
  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    return User.create(data);
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async findById(id: string) {
    return User.findByPk(id);
  }

  async updateName(id: string, name: string) {
    await User.update({ name }, { where: { id } });
    return this.findById(id);
  }

  async findAll() {
    return User.findAll();
  }
}