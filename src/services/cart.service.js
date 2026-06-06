import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import { AppError } from '../utils/AppError.js';

export class CartService {

    async getCart(cartId) {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new AppError('Carrito no encontrado', 404);
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const product = await productRepository.findById(productId);
        if (!product) throw new AppError('Producto no encontrado', 404);

        if (product.stock < quantity) {
            throw new AppError(`Stock insuficiente. Disponible: ${product.stock}`, 400);
        }

        return await cartRepository.addProduct(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await cartRepository.removeProduct(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (quantity <= 0) {
            return await this.removeProductFromCart(cartId, productId);
        }

        const product = await productRepository.findById(productId);
        if (!product) throw new AppError('Producto no encontrado', 404);

        if (product.stock < quantity) {
            throw new AppError(`Stock insuficiente. Disponible: ${product.stock}`, 400);
        }

        return await cartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await cartRepository.clear(cartId);
    }

    async getCartTotal(cart) {
        let total = 0;

        if (!cart.products || cart.products.length === 0) {
            return total;
        }

        cart.products.forEach(item => {
            if (item.product) {
                total += item.product.price * item.quantity;
            }
        });

        return Number(total.toFixed(2));
    }

    async validateCartProducts(cart) {
        const result = {
            validProducts: [],
            invalidProducts: [],
            total: 0
        };

        if (!cart.products || cart.products.length === 0) {
            return result;
        }

        const productIds = cart.products.map(item => item.product._id || item.product);
        const products = await productRepository.findByIdMultiple(productIds);
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        for (const item of cart.products) {
            const productId = item.product._id || item.product;
            const product = productMap.get(productId.toString());

            if (!product) {
                result.invalidProducts.push({
                    productId,
                    reason: 'Producto no encontrado'
                });
            } else if (product.stock < item.quantity) {
                result.invalidProducts.push({
                    productId: product._id,
                    title: product.title,
                    requestedQuantity: item.quantity,
                    availableStock: product.stock,
                    reason: 'Stock insuficiente'
                });
            } else {
                result.validProducts.push({
                    productId: product._id,
                    title: product.title,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: product.price * item.quantity
                });
                result.total += product.price * item.quantity;
            }
        }

        result.total = Number(result.total.toFixed(2));
        return result;
    }
}

export default new CartService();
