import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { getPrices } from "../store/store";
import {
  Base,
  Instant,
  Period,
  PriceAtInstant,
} from "../validation/domain.types";
import { Record } from "runtypes";
import { periodToUtcRange } from "../time/period";
import { DateTime } from "luxon";

const Event = Record({
  pathParameters: Record({
    asset: Base,
  }),
  queryStringParameters: Record({
    period: Period,
  }),
});

export const getPricesForCurrentPeriod = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!Event.guard(event)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unexpected Input" }),
      };
    }

    const range = periodToUtcRange(
      Instant.check(DateTime.utc().valueOf()),
      event.queryStringParameters.period
    );

    const result = await getPrices(new DynamoDB({}), {
      ...range,
      base: event.pathParameters.asset,
    });

    if (result instanceof Error) {
      throw result;
    }

    const priceList: Array<PriceAtInstant> = result;

    return {
      statusCode: 200,
      body: JSON.stringify({ priceList }),
    };
  } catch ({ message }) {
    console.error(message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
