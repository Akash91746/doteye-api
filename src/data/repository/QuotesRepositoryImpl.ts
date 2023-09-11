import axios from "axios";
import * as cheerio from 'cheerio';

import DolorBlueQuote from "../../domain/models/DolorBlueQuote";
import QuotesRepository from "../../domain/repository/QuotesRepository";
import Result from "../../utils/Result";

class QuotesRepositoryImpl implements QuotesRepository {

    async getQuotes(): Promise<Result<DolorBlueQuote[]>> {
        const result: DolorBlueQuote[] = [];

        const dolorHoyResult = await this.fromDolorHoy();

        if (dolorHoyResult.isSuccess && dolorHoyResult.value) {
            result.push(dolorHoyResult.value);
        }

        const ambitoResult = await this.fromAmbito();

        if (ambitoResult.isSuccess && ambitoResult.value) {
            result.push(ambitoResult.value);
        }

        const cronistaResult = await this.fromCronista();

        if (cronistaResult.isSuccess && cronistaResult.value) {
            result.push(cronistaResult.value);
        }

        return Result.success(result);
    };

    private async fromDolorHoy(): Promise<Result<DolorBlueQuote>> {
        try {
            const source = "https://dolarhoy.com/i/cotizaciones/dolar-blue"

            const response = await axios.get(source);

            const $ = cheerio.load(response.data);

            const buyValue = $('.data__valores p').first();

            const sellValue = $('.data__valores p').last();

            buyValue.children().remove();
            sellValue.children().remove();

            const result: DolorBlueQuote = {
                buy_price: parseFloat(buyValue.text()),
                sell_price: parseFloat(sellValue.text()),
                source: source
            }

            return Result.success(result);
        } catch (e) {
            return Result.failed(e as Error);
        }
    };

    private async fromAmbito(): Promise<Result<DolorBlueQuote>> {
        try {

            const source = "https://mercados.ambito.com//dolar/informal/historico-cierre";

            const response = await axios.get(source);

            const buyValue = response.data.compra;
            const sellValue = response.data.venta;

            const quote: DolorBlueQuote = {
                buy_price: parseFloat(buyValue),
                sell_price: parseFloat(sellValue),
                source: source
            }

            return Result.success(quote);
        } catch (e) {
            return Result.failed(e as Error);
        }
    };

    private async fromCronista(): Promise<Result<DolorBlueQuote>> {
        try {
            const source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";

            const response = await axios.get(source);

            const $ = cheerio.load(response.data);

            const sellValue = $('.sell-value');

            sellValue.children('span').remove();

            const buyValue = $('.buy-value');

            buyValue.children('span').remove();

            const quote: DolorBlueQuote = {
                buy_price: parseFloat(buyValue.text()),
                sell_price: parseFloat(sellValue.text()),
                source: source
            }

            return Result.success(quote);
        } catch (e) {
            return Result.failed(e as Error);
        }
    };

}

export default QuotesRepositoryImpl;