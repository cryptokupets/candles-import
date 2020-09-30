require("mocha");
const { assert } = require("chai");
const { CandlesImport } = require("../lib/CandlesImport");

describe("CandlesImport", () => {
    it("execute", function (done) {
        const options = {
            exchange: "hitbtc",
            currency: "USD",
            asset: "BTC",
            period: 1,
            begin: "2020-09-01T00:00:00",
            end: "2020-09-01T23:59:00",
        };

        CandlesImport.execute(options).then((candles) => {
            assert.isArray(candles, "массив данных");
            assert.isObject(candles[0], "первый элемент является свечей");
            assert.isAtLeast(candles.length, 1000, "длина больше 1000");
            done();
        });
    });
});
