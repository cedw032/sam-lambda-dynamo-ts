# Get prices change API

- NOTE: This API does not get price changes. Currently it gets a historical list of prices.
- NOTE: This API has not been backfilled with data. Many of the supported periods will not return complete result sets
- NOTE: Some payloads may be large as pagination is not currently supported.

## Usage

### Bitcoin Prices

- [bitcoin today](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/BTC/price_changes?period=today) - The prices in AUD of bitcoin at five minute intervals spanning 24 hours up until the top of the last hour in UTC.
- [bitcoin this week](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/BTC/price_changes?period=week) - The prices in AUD of bitcoin at five minute intervals spanning 7 days up until the top of the last quarter day in UTC.
- [bitcoin this quarter](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/BTC/price_changes?period=quarter) - The prices in AUD of bitcoin at five minute intervals spanning 3 months up until the start of the day in UTC.
- [bitcoin this year](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/BTC/price_changes?period=year) - The prices in AUD of bitcoin at five minute intervals spanning 1 year up until the start of this Monday in UTC.

### Ethereum Prices

- [ethereum today](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/ETH/price_changes?period=today) - The prices in AUD of ethereum at five minute intervals spanning 24 hours up until the top of the last hour in UTC.
- [ethereum this week](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/ETH/price_changes?period=week) - The prices in AUD of ethereum at five minute intervals spanning 7 days up until the top of the last quarter day in UTC.
- [ethereum this quarter](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/ETH/price_changes?period=quarter) - The prices in AUD of ethereum at five minute intervals spanning 3 months up until the start of the day in UTC.
- [ethereum this year](https://wmmhun6fol.execute-api.ap-southeast-2.amazonaws.com/Prod/asset/ETH/price_changes?period=year) - The prices in AUD of ethereum at five minute intervals spanning 1 year up until the start of this Monday in UTC.

### Responses

All responses are json with the following form

```json
{
  "priceList": [
    {
      "base": "BTC", // Either BTC or ETH
      "currency": "AUD", // All prices are in AUD
      "amount": "54354.34534", // The price of the asset in AUD
      "instant": 3456345 // The unix timestamp of when this price was recorded
    }
  ]
}
```

## Testing

To run the tests you will need:

- docker
- npm
- git

Then:

- `git clone git@github.com:cedw032/sam-lambda-dynamo-ts.git`
- `cd sam-lambda-dynamo-ts/api`
- `npm i`
- `npm run test`

## deploy

To deploy you will need:

- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)

Then:

- `git clone git@github.com:cedw032/sam-lambda-dynamo-ts.git`
- `cd sam-lambda-dynamo-ts`
- `sam build`
- `npm deploy --guided`
