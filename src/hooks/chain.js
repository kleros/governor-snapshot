import { useState, useEffect } from "react";

const MISSING_CHAIN_ERROR_CODE = 4902;

export const useFetchChainId = (web3) => {
  const [chainId, setChainId] = useState();

  useEffect(() => {
    web3.eth.getChainId().then((chainId) => {
      const chainIdAsHexa = `0x${chainId.toString(16)}`; 
      setChainId(chainIdAsHexa)
    });
  }, []);

  return chainId;
};

export const askForChainChange = async (chain) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.id }], 
      });
    } catch (error) {
      if (MISSING_CHAIN_ERROR_CODE === error.code) {
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
