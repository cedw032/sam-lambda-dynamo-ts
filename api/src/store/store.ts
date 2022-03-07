import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { Base, Instant, PriceAtInstant } from "../validation/domain.types";

const tableName = "Price";

export async function putPrice(
  client: DynamoDB,
  { base: base_, ...price }: PriceAtInstant
): Promise<Error | undefined> {
  try {
    await client.putItem({
      TableName: "Price",
      Item: marshall({ base_, ...price }),
    });
  } catch ({ message }) {
    console.error(message);
    return new Error("Internal Server Error");
  }
}

type GetPricesWithinRangeParams = { start: Instant; end: Instant; base: Base };
export async function getPrices(
  client: DynamoDB,
  { start, end, base }: GetPricesWithinRangeParams
): Promise<Error | Array<PriceAtInstant>> {
  try {
    const result = await client.query({
      TableName: tableName,
      ExpressionAttributeValues: marshall({
        ":start": start,
        ":end": end,
        ":base": base,
      }),
      KeyConditionExpression:
        "base_ = :base AND instant BETWEEN :start AND :end",
    });
    return (
      result.Items?.map((i) => {
        const { base_: base, ...price } = unmarshall(i);
        return PriceAtInstant.check({ base, ...price });
      }) ?? []
    );
  } catch ({ message }) {
    console.error(message);
    return new Error("Internal Server Error");
  }
}
