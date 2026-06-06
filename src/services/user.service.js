import userRepository from '../repositories/user.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import { generateTokenEmail, verifyTokenEmail } from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';
import { AppError } from '../utils/AppError.js';
import bcrypt from 'bcrypt';

export class UserService {

    async registerUser(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) throw new AppError('El email ya está registrado', 409);

        const newCart = await cartRepository.create();

        const userToCreate = {
            ...userData,
            cart: newCart._id
        };

        return await userRepository.create(userToCreate);
    }

    async findUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);
        return user;
    }

    async findUserByEmail(email) {
        return await userRepository.findByEmail(email);
    }

    async validatePassword(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        if (!user.isValidPassword(password)) {
            throw new AppError('Contraseña incorrecta', 401);
        }

        return user;
    }

    async requestPasswordReset(email) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        const resetToken = generateTokenEmail(user._id.toString());
        const expiryDate = new Date(Date.now() + 3600000);

        await userRepository.updateResetToken(user._id, resetToken, expiryDate);

        const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
        const resetLink = `${baseUrl}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(email, resetLink, user.first_name);

        return { message: 'Email de recuperación enviado' };
    }

    async resetPassword(token, newPassword) {
        const decoded = verifyTokenEmail(token);
        if (!decoded) throw new AppError('Token inválido o expirado', 400);

        const user = await userRepository.findByResetToken(token);
        if (!user) throw new AppError('Token inválido o expirado', 400);

        if (user.isValidPassword(newPassword)) {
            throw new AppError('La nueva contraseña no puede ser igual a la anterior', 400);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        return await userRepository.updatePassword(user._id, hashedPassword);
    }

    async getAllUsers(options = {}) {
        return await userRepository.findAll({}, options);
    }

    async updateUser(id, updateData) {
        const { email, role, password, ...safeData } = updateData;

        return await userRepository.update(id, safeData);
    }

    async deleteUser(id) {
        const user = await this.findUserById(id);

        if (user.cart) {
            await cartRepository.delete(user.cart);
        }

        return await userRepository.delete(id);
    }
}

export default new UserService();
