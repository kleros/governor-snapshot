import { useState, useEffect } from "react";

export const useFetchAccount = (web3) => {
  const [account, setAccount] = useState();

  useEffect(() => {
    web3.eth.getAccounts().then((_a) => setAccount(_a[0]));
  }, []);

  return account;
};
