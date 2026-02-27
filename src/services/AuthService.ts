import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";

const userRepository = new UserRepository();

interface JWTUserPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}

export class AuthService {
    async register(name: string, email: string, password: string) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }   
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        return {
            message: 'Usiario registrado exitosamente',
        };
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            } as JwtPayload,
            process.env.JWT_SECRET as string,
            { expiresIn: '3h' }
        );

        return {
            token, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
       
}