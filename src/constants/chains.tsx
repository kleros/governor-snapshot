import { ReactComponent as EtherscanLogo } from "../assets/logos/etherscan.svg";
import { ReactComponent as GnosisLogo } from "../assets/logos/gnosis.svg";
import { Chain } from "../types";

const mainnet: Chain = {
  id: "0x1",
  name: "Mainnet",
  rpcUrls: ["https://mainnet.infura.io/v3/"],
  blockExplorerUrls: ["https://etherscan.io"],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  icon: <EtherscanLogo />,
  scanContractUrl: (contractAddress) =>
    `https://etherscan.io/address/${contractAddress}#code`,
  scanAddressUrl: (address) => `https://etherscan.io/address/${address}`,
  //Blockscout because Etherscan V1 API was discontinued and V2 requires an API key
  //We can switch later if needed
  scanAbiUrl: (contractAddress) =>
    `https://eth.blockscout.com/api?module=contract&action=getabi&address=${contractAddress}`,
  scanListSubmittedLogsUrl: (address, eventSignature, session) =>
    `https://eth.blockscout.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&topic0=${eventSignature}&topic3=${session}&topic0_3_opr=and`,
};

const gnosis: Chain = {
  id: "0x64",
  name: "Gnosis",
  rpcUrls: ["https://rpc.gnosischain.com"],
  blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"],
  nativeCurrency: {
    name: "XDAI",
    symbol: "xDAI",
    decimals: 18,
  },
  icon: <GnosisLogo />,
  scanContractUrl: (contractAddress) =>
    `https://gnosis.blockscout.com/address/${contractAddress}?tab=contract`,
  scanAddressUrl: (address) =>
    `https://gnosis.blockscout.com/address/${address}`,
  scanAbiUrl: (contractAddress) =>
    `https://gnosis.blockscout.com/api?module=contract&action=getabi&address=${contractAddress}`,
  scanListSubmittedLogsUrl: (address, eventSignature, session) =>
    `https://gnosis.blockscout.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&topic0=${eventSignature}&topic3=${session}&topic0_3_opr=and`,
};

const chainMap = {
  1: mainnet,
  100: gnosis,
};

export default chainMap;
