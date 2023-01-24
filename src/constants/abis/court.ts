import { AbiItem } from "web3-utils";
import courtAbiJson from "./court.json";

let courtAbi: AbiItem[] = [];

courtAbiJson.abi.forEach((item: any) => {
  courtAbi.push(item);
});

export default courtAbi;
