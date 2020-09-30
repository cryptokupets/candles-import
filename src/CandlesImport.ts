import { Exchange as Hitbtc } from "hitbtc-connect";
import moment from "moment";
import { ICandle } from "./ICandle";

const exchanges: any = {
    hitbtc: new Hitbtc(),
};

function getExchange(exchange: string): IMarketDataSource {
    return exchanges[exchange] as IMarketDataSource;
}

interface IMarketDataSource {
    getCandles(options: {
        currency: string;
        asset: string;
        period: number;
        start: string;
        end: string;
    }): Promise<ICandle[]>;
}

export class CandlesImport {
    public static async execute(options: {
        exchange: string;
        currency: string;
        asset: string;
        period: number;
        begin: string;
        end: string;
    }): Promise<ICandle[]> {
        const { exchange, currency, asset, period, begin, end } = options;
        let beginMoment = moment.utc(begin);
        let candles: ICandle[] = [];

        while (beginMoment.isSameOrBefore(moment.utc(end))) {
            const response = await getExchange(exchange).getCandles({
                currency,
                asset,
                period,
                start: beginMoment.toISOString(),
                end,
            });
            if (response.length) {
                beginMoment = moment
                    .utc(response[response.length - 1].time)
                    .add(period, "m");
                candles = candles.concat(response);
            }
        }

        return candles;
    }
}
