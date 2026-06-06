import cartService from '../services/cart.service.js';
import checkoutService from '../services/checkout.service.js';
import { sendPurchaseConfirmationEmail } from '../utils/mailer.js';
import { CartDTO } from '../dtos/cart.dto.js';
import { PurchaseResultDTO } from '../dtos/ticket.dto.js';
import cartRepository from '../repositories/cart.repository.js';

export const createCart = async (req, res, next) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json({
            status: 'success',
            payload: new CartDTO(cart, 0)
        });
    } catch (error) {
        next(error);
    }
};

export const getCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const cart = await cartService.getCart(cartId);
        const total = await cartService.getCartTotal(cart);
        res.status(200).json({
            status: 'success',
            payload: new CartDTO(cart, total)
        });
    } catch (error) {
        next(error);
    }
};

export const addProductToCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'productId es requerido'
            });
        }

        const updatedCart = await cartService.addProductToCart(
            cartId,
            productId,
            parseInt(quantity)
        );

        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Producto agregado al carrito',
            payload: new CartDTO(updatedCart, total)
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductQuantity = async (req, res, next) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cantidad debe ser mayor a 0'
            });
        }

        const updatedCart = await cartService.updateProductQuantity(
            cartId,
            productId,
            parseInt(quantity)
        );

        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Cantidad actualizada',
            payload: new CartDTO(updatedCart, total)
        });
    } catch (error) {
        next(error);
    }
};

export const removeProductFromCart = async (req, res, next) => {
    try {
        const { cartId, productId } = req.params;
        const updatedCart = await cartService.removeProductFromCart(cartId, productId);
        const total = await cartService.getCartTotal(updatedCart);

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito',
            payload: new CartDTO(updatedCart, total)
        });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const clearedCart = await cartService.clearCart(cartId);

        res.status(200).json({
            status: 'success',
            message: 'Carrito vaciado',
            payload: new CartDTO(clearedCart, 0)
        });
    } catch (error) {
        next(error);
    }
};

export const purchaseCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const userEmail = req.user.email || req.body.email;

        if (!userEmail) {
            return res.status(400).json({
                status: 'error',
                message: 'Email requerido para procesar la compra'
            });
        }

        const ticket = await checkoutService.purchaseCart(cartId, userEmail);

        try {
            await sendPurchaseConfirmationEmail(userEmail, ticket);
        } catch (emailError) {
            console.error('Error al enviar email de confirmación:', emailError);
        }

        res.status(201).json({
            status: 'success',
            message: 'Compra procesada exitosamente',
            payload: new PurchaseResultDTO(ticket)
        });
    } catch (error) {
        next(error);
    }
};

export const getTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const ticket = await checkoutService.getTicket(ticketId);

        res.status(200).json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        next(error);
    }
};
