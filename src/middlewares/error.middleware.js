import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Error interno del servidor';
    let details = null;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Error de validación';
        details = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Recurso no encontrado';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'El recurso ya existe';
        const field = Object.keys(err.keyPattern)[0];
        details = `${field} debe ser único`;
    } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = 400;
        message = 'JSON inválido';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado';
    } else {
        statusCode = err.statusCode || 500;
        message = err.message || 'Error interno del servidor';
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', {
            statusCode,
            message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
    }

    res.status(statusCode).json({
        status: 'error',
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};