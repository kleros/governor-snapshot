import React from "react";
import { ReactComponent as EtherscanLogo } from "../assets/logos/etherscan.svg";

export default {
  1: {
    id: '0x1',
    name: "Mainnet",
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExploreUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH', 
      decimals: 18,
    },
    icon: <EtherscanLogo />,
    scanContractUrl: (contractAddress) =>
      `https://etherscan.io/address/${contractAddress}#code`,
    scanAddressUrl: (address) => `https://etherscan.io/address/${address}`,
    scanAbiUrl: (contractAddress) =>
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`,
  }
};
