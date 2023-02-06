import { useEffect, useState } from "react";
import web3 from "../ethereum/web3";
import { Chain } from "../types";

const MISSING_CHAIN_ERROR_CODE = 4902;

class ChainError {
  code: number
  constructor(props: { code: number }) {
    this.code = props.code;
  }
}

export const useFetchChainId = () => {
  const [chainId, setChainId] = useState<string>("");

  useEffect(() => {
    web3.eth.getChainId().then((chainId) => {
      const chainIdAsHexa = `0x${chainId.toString(16)}`;
      setChainId(chainIdAsHexa)
    });
  }, []);

  return chainId;
};


export const switchCurrentChain = async (chain: Chain) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.id }],
      });
    } catch (error) {
      const errorCode: number = error instanceof ChainError ? error.code : 0;
      if (MISSING_CHAIN_ERROR_CODE === errorCode) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chain.id,
                chainName: chain.name,
                rpcUrls: chain.rpcUrls,
                blockExplorerUrls: chain.blockExplorerUrls,
                nativeCurrency: chain.nativeCurrency
              },
            ],
          });
        } catch (addError) {
          console.error(`addEthereumChain failes with: ${JSON.stringify(addError)}`);
        }
      }
      console.error(`wallet_switchEthereumChain failes with: ${JSON.stringify(error)}`);
    }
  } else {
    alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
  }
}
