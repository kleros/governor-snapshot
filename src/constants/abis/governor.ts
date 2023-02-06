import { AbiItem } from "web3-utils";
import governorAbiJson from "./governor.json";

let governorAbi: AbiItem[] = [];

governorAbiJson.abi.forEach((item: any) => {
  governorAbi.push(item);
});

export default governorAbi;
