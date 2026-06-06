import productRepository from '../repositories/product.repository.js';
import { AppError } from '../utils/AppError.js';

export class ProductService {

    async getProducts(query = {}, options = { limit: 10, page: 1 }) {
        return await productRepository.findAll(query, options);
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) throw new AppError('Producto no encontrado', 404);
        return product;
    }

    async createProduct(productData) {
        if (!productData.title || !productData.description || !productData.code || !productData.price || !productData.stock) {
            throw new AppError('Faltan datos requeridos del producto', 400);
        }

        const existingProduct = await productRepository.findByCode(productData.code);
        if (existingProduct) throw new AppError('El código del producto ya existe', 409);

        return await productRepository.create(productData);
    }

    async updateProduct(id, updateData) {
        const product = await this.getProductById(id);

        if (updateData.code && updateData.code !== product.code) {
            const existingProduct = await productRepository.findByCode(updateData.code);
            if (existingProduct) throw new AppError('El código del producto ya existe', 409);
        }

        return await productRepository.update(id, updateData);
    }

    async deleteProduct(id) {
        await this.getProductById(id);
        return await productRepository.delete(id);
    }

    async checkStock(productId, quantity) {
        const product = await this.getProductById(productId);

        return {
            available: product.stock >= quantity,
            requested: quantity,
            inStock: product.stock,
            canPurchase: Math.min(quantity, product.stock)
        };
    }

    async decreaseStock(productId, quantity) {
        const product = await this.getProductById(productId);

        if (product.stock < quantity) {
            throw new AppError(`Stock insuficiente. Disponible: ${product.stock}, solicitado: ${quantity}`, 400);
        }

        return await productRepository.decreaseStock(productId, quantity);
    }
}

export default new ProductService();
