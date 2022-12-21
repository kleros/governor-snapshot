import React from "react";
import { ReactComponent as EtherscanLogo } from "../assets/logos/etherscan.svg";
import { ReactComponent as GnosisLogo } from "../assets/logos/gnosis.svg";
import { Chain } from "../types"

const mainnet: Chain = new Chain({
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
})

const gnosis: Chain = new Chain({
  id: '0x64',
  name: "Gnosis",
  rpcUrls: ['https://rpc.gnosischain.com'],
  blockExploreUrls: ['https://blockscout.com/xdai/mainnet/'],
  nativeCurrency: {
    name: 'XDAI',
    symbol: 'xDAI',
    decimals: 18,
  },
  icon: <GnosisLogo />,
  scanContractUrl: (contractAddress) =>
    `https://blockscout.com/xdai/mainnet/address/${contractAddress}/contracts#address-tabs`,
  scanAddressUrl: (address) =>
    `https://blockscout.com/xdai/mainnet/address/${address}`,
  scanAbiUrl: (contractAddress) =>
    `https://blockscout.com/xdai/mainnet/api?module=contract&action=getabi&address=${contractAddress}`,
})

const chainMap: any = {
  1: mainnet,
  100: gnosis
}

export default chainMap

