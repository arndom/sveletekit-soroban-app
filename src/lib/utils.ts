import { scValToNative, type xdr } from "@stellar/stellar-sdk";
import type { WrappedContract } from "./soroban-contracts/types";

export function getShortAddress(addr: string | undefined) {
  if (!addr) return "";

  const lastIndex = addr.length - 1;
  return addr.substring(0, 4) + "..." + addr.substring(lastIndex - 3)
}

export const fetchLastMessage = async (contract: WrappedContract) => {
  const errorMsg = "Failed to fetch. Try again later";

  try {
    const result = await contract.invoke({
      method: "read_title",
      args: [],
    });

    if (!result) return errorMsg;

    // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
    // You can check out the scValConversion.tsx file to see how it's done
    const result_string = scValToNative(result as xdr.ScVal) as string;

    return result_string;
  } catch (e) {
    console.error(e);

    return errorMsg;
  }
};