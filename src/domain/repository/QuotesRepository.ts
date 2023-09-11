import Result from "../../utils/Result";
import DolorBlueQuote from "../models/DolorBlueQuote";

interface QuotesRepository {
    getQuotes(): Promise<Result<DolorBlueQuote[]>>
}

export default QuotesRepository;