import express from "express";
import {
    createCart,
    getCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart,
    purchaseCart,
    getTicket
} from '../controllers/cart.controller.js';
import { authMiddleware, userOnly } from '../middlewares/auth.middleware.js';

const cartRouter = express.Router();

/**
 * POST / - Crear carrito
 */
cartRouter.post('/', createCart);

/**
 * GET /:cartId - Obtener carrito
 */
cartRouter.get('/:cartId', getCart);

/**
 * GET /ticket/:ticketId - Obtener ticket
 */
cartRouter.get('/ticket/:ticketId', getTicket);

/**
 * POST /:cartId/product - Agregar producto al carrito (solo usuarios)
 */
cartRouter.post('/:cartId/product', authMiddleware, userOnly, addProductToCart);

/**
 * PUT /:cartId/product/:productId - Actualizar cantidad
 */
cartRouter.put('/:cartId/product/:productId', authMiddleware, userOnly, updateProductQuantity);

/**
 * DELETE /:cartId/product/:productId - Eliminar producto
 */
cartRouter.delete('/:cartId/product/:productId', authMiddleware, userOnly, removeProductFromCart);

/**
 * DELETE /:cartId - Vaciar carrito
 */
cartRouter.delete('/:cartId', authMiddleware, userOnly, clearCart);

/**
 * POST /:cartId/purchase - Procesar compra (solo usuarios)
 */
cartRouter.post('/:cartId/purchase', authMiddleware, userOnly, purchaseCart);

export default cartRouter;
