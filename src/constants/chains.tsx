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
  scanAbiUrl: (contractAddress) =>
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`,
};

const goerli: Chain = {
  id: "0x5",
  name: "Goerli",
  rpcUrls: ["https://goerli.infura.io/v3"],
  blockExplorerUrls: ["https://goerli.etherscan.io"],
  nativeCurrency: {
    name: "GoerliETH",
    symbol: "GoerliETH",
    decimals: 18,
  },
  icon: <EtherscanLogo />,
  scanContractUrl: (contractAddress) =>
    `https://goerli.etherscan.io/address/${contractAddress}#code`,
  scanAddressUrl: (address) => `https://goerli.etherscan.io/address/${address}`,
  scanAbiUrl: (contractAddress) =>
    `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`,
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
};

const chainMap = {
  1: mainnet,
  5: goerli,
  100: gnosis,
};

export default chainMap;
