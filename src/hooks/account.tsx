import { useState, useEffect } from "react";
import web3 from "../ethereum/web3";

export const useFetchAccount = () => {
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    web3.eth.getAccounts().then((_a) => setAccount(_a[0]));
  }, []);

  return account;
};
