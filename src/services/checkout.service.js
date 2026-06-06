import ticketRepository from '../repositories/ticket.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import cartService from './cart.service.js';
import { AppError } from '../utils/AppError.js';

export class CheckoutService {

    async purchaseCart(cartId, userEmail) {
        const cart = await cartRepository.findById(cartId);
        if (!cart || !cart.products || cart.products.length === 0) {
            throw new AppError('Carrito vacío o no encontrado', 400);
        }

        const validatedProducts = await cartService.validateCartProducts(cart);

        if (validatedProducts.validProducts.length === 0) {
            throw new AppError('No hay productos válidos para comprar', 400);
        }

        const ticketCode = await ticketRepository.generateUniqueCode();

        const ticketData = {
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: validatedProducts.total,
            purchaser: userEmail,
            products: validatedProducts.validProducts,
            failedProducts: validatedProducts.invalidProducts,
            status: validatedProducts.invalidProducts.length > 0 ? 'partial' : 'completed'
        };

        const ticket = await ticketRepository.create(ticketData);

        for (const product of validatedProducts.validProducts) {
            await productRepository.decreaseStock(product.productId, product.quantity);
        }

        await cartRepository.clear(cartId);

        return ticket;
    }

    async getTicket(ticketId) {
        const ticket = await ticketRepository.findById(ticketId);
        if (!ticket) throw new AppError('Ticket no encontrado', 404);
        return ticket;
    }

    async getTicketByCode(code) {
        const ticket = await ticketRepository.findByCode(code);
        if (!ticket) throw new AppError('Ticket no encontrado', 404);
        return ticket;
    }

    async getUserTickets(userEmail) {
        return await ticketRepository.findByPurchaser(userEmail, { sort: { createdAt: -1 } });
    }

    async getAllTickets(options = {}) {
        return await ticketRepository.findAll({}, options);
    }
}

export default new CheckoutService();
