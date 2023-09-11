import { ErrorRequestHandler } from "express";

const globalErrorHander: ErrorRequestHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    error.message = error.message || 'Something went wrong';

    console.error(error);

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
}

export default globalErrorHander;