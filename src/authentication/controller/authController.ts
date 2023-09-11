import { NextFunction, Request, Response } from "express";
import catchAsyncRequest from "../../utils/catchAsyncRequest";
import AppError from "../../utils/AppError";
import ResponseStatus from "../../utils/ResponseStatus";

export const getCurrentLoggedInUser = catchAsyncRequest(async (req, res, next) => {

    if (!req.user) {
        return next(new AppError("Not Authroized", 403));
    }

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        user: req.user
    });
});


export const handleGoogleAuthFailure = async (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Google Auth Failed", 400));
};