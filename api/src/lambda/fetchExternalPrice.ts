import { fetchCurrentSpotPrice } from "../external/fetchCurrentSpotPrice";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { putPrice } from "../store/store";

export const fetchBitcoinPrice = async () => {
  const priceResult = await fetchCurrentSpotPrice({ base: "BTC" });
  if (priceResult instanceof Error) {
    console.error(priceResult.message);
    return;
  }
  const putResult = await putPrice(new DynamoDB({}), priceResult);
  if (putResult instanceof Error) {
    console.error(putResult.message);
    return;
  }
};

export const fetchEthereumPrice = async () => {
  const priceResult = await fetchCurrentSpotPrice({ base: "ETH" });
  if (priceResult instanceof Error) {
    console.error(priceResult.message);
    return;
  }
  const putResult = await putPrice(new DynamoDB({}), priceResult);
  if (putResult instanceof Error) {
    console.error(putResult.message);
    return;
  }
};
