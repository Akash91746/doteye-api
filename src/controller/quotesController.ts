import nodeCron from 'node-cron';

import QuotesRepositoryImpl from "../data/repository/QuotesRepositoryImpl";
import DolorBlueQuote from "../domain/models/DolorBlueQuote";
import redisClient from "../redisClient";
import ResponseStatus from "../utils/ResponseStatus";
import catchAsyncRequest from "../utils/catchAsyncRequest";
import AppError from '../utils/AppError';
import CacheData from '../utils/CacheData';

const repository = new QuotesRepositoryImpl();

nodeCron.schedule("* * * * * *", async () => {
    await fetchAndCatchQuotes();
});

const fetchAndCatchQuotes = async () => {
    const timeStamp = new Date(Date.now());

    const result = await repository.getQuotes();

    if (result.value == undefined) {
        return;
    }

    const data: CacheData<DolorBlueQuote[]> = {
        data: result.value,
        updatedAt: timeStamp.toString()
    }

    redisClient.set("/quotes", JSON.stringify(data));

    return data;
}

export const getCacheQuotes = async () => {
    const cache = await redisClient.get('/quotes');

    let data;

    if (cache == null) {
        const result = await fetchAndCatchQuotes();

        if (result == undefined) {
            return undefined;
        }

        data = result;
    } else {
        data = JSON.parse(cache) as CacheData<DolorBlueQuote[]>;
    }

    return data;
}

export const getQuotes = catchAsyncRequest(async (req, res, next) => {

    const data = await getCacheQuotes();

    if (data == undefined) {
        return next(new AppError("Failed to fetch data", 404));
    }

    const quotes = data.data;
    const updatedAt = data.updatedAt;

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        data: quotes,
        updatedAt
    });
});

export const getAverageResult = async () => {
    const result = await getCacheQuotes();

    if (result == undefined) {
        return undefined;
    }

    let totalBuyPrice = 0;
    let totalSellPrice = 0;
    let totalQuotes = result.data.length;

    result.data.forEach(quote => {
        totalBuyPrice += quote.buy_price;
        totalSellPrice += quote.sell_price;
    });

    const averageBuyPrice = totalBuyPrice / totalQuotes;
    const averageSellPrice = totalSellPrice / totalQuotes;

    return {
        data: {
            average_buy_price: averageBuyPrice.toFixed(2),
            average_sell_price: averageSellPrice.toFixed(2)
        },
        updatedAt: result.updatedAt
    }
}

export const getAverage = catchAsyncRequest(async (req, res, next) => {

    const result = await getAverageResult();

    if (result == undefined) {
        return next(new AppError("Failed to fetch data ", 404));
    }

    res.status(200).json({
        status: ResponseStatus.SUCCESS,
        data: result.data,
        updatedAt: result.updatedAt
    });
});


