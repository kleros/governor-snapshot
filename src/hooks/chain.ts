import { useEffect, useState } from "react";
import web3 from "../ethereum/web3";
import { Chain } from "../types";

const MISSING_CHAIN_ERROR_CODE = 4902;

export const useFetchChainId = () => {
  const [chainId, setChainId] = useState<string>("");

  useEffect(() => {
    web3.eth.getChainId().then((chainId) => {
      const chainIdAsHexa = `0x${chainId.toString(16)}`;
      setChainId(chainIdAsHexa)
    });

    const onChainChanged = () => window.location.reload();
    window.ethereum?.on?.("chainChanged", onChainChanged);
    return () => window.ethereum?.removeListener?.("chainChanged", onChainChanged);
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
      const err: any = error;
      //MM mobile nests the error code in a different structure
      const errorCode: number = err?.data?.originalError?.code ?? err?.code ?? 0;
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
