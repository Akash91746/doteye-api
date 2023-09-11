import { NextFunction, Request, Response } from "express";


const catchAsyncRequest = (
    fn: (req: Request<any, any, any, any>, res: Response<any, any>, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction): Promise<any> => {

    return fn(req, res, next).catch((err: any) => {
        next(err);
    });
};

export default catchAsyncRequest;