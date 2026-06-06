import adoptionRepository from '../repositories/adoption.repository.js';
import { AppError } from '../utils/AppError.js';

export class AdoptionService {
    async getAll(filter = {}) {
        return await adoptionRepository.findAll(filter);
    }

    async getById(id) {
        const adoption = await adoptionRepository.findById(id);
        if (!adoption) {
            throw new AppError('Animal no encontrado en adopción', 404);
        }
        return adoption;
    }

    async create(data) {
        if (!data.name || !data.species || data.age === undefined || !data.description) {
            throw new AppError('Faltan datos requeridos del animal', 400);
        }
        if (data.age < 0) {
            throw new AppError('La edad no puede ser negativa', 400);
        }
        return await adoptionRepository.create(data);
    }

    async update(id, data) {
        await this.getById(id);
        return await adoptionRepository.update(id, data);
    }

    async delete(id) {
        await this.getById(id);
        return await adoptionRepository.delete(id);
    }

    async adopt(id, owner) {
        if (!owner) {
            throw new AppError('Se requiere el nombre del adoptante', 400);
        }
        const adoption = await this.getById(id);
        if (adoption.status === 'adopted') {
            throw new AppError('El animal ya fue adoptado', 409);
        }
        return await adoptionRepository.update(id, {
            status: 'adopted',
            owner,
            adoptedAt: new Date()
        });
    }
}

export default new AdoptionService();
