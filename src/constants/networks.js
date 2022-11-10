import React from "react";
import { ReactComponent as EtherscanLogo } from "../assets/logos/etherscan.svg";
import { ReactComponent as GnosisLogo } from "../assets/logos/gnosis.svg";

export default {
  1: {
    name: "Mainnet",
    scan_name: "Etherscan",
    scan_icon: <EtherscanLogo />,
    scan_contract_url: (contractAddress) =>
      `https://etherscan.io/address/${contractAddress}#code`,
    scan_address_url: (address) => `https://etherscan.io/address/${address}`,
    scan_abi_url: (contractAddress) =>
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`,
  },
  100: {
    name: "Gnosis",
    scan_name: "BlockScout",
    scan_icon: <GnosisLogo />,
    scan_contract_url: (contractAddress) =>
      `https://blockscout.com/xdai/mainnet/address/${contractAddress}/contracts#address-tabs`,
    scan_address_url: (address) =>
      `https://blockscout.com/xdai/mainnet/address/${address}`,
    scan_abi_url: (contractAddress) =>
      `https://blockscout.com/xdai/mainnet/api?module=contract&action=getabi&address=${contractAddress}`,
  },
};
