import ResponseStatus from "./ResponseStatus";

export interface ErrorData {
    message?: string,
    statusCode?: number
}

class AppError extends Error {

    readonly status;
    readonly statusCode;
    readonly isOperational = true;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? ResponseStatus.FAIL : ResponseStatus.ERROR;
    }

}

export default AppError;