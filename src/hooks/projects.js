import { useState, useEffect } from "react";
import Projects from "../constants/projects";
import { useLocalStorage } from "./local";

export const useFetchAllProjects = () => {
  const [allProjects, setAllProjects] = useState([]);

  // TODO have it fetch from remote server
  useEffect(() => {
    setAllProjects(Projects);
  }, []);

  return allProjects;
};

export const useFetchProjectByName = (name) => {
  const _project = Projects.filter((p) => p.name === name);

  return _project[0];
};

export const useFetchMethodsForContract = (
  contractAddress,
  chain
) => {
  const [ abiCache, setAbiCache ] = useLocalStorage('ABIS', {})

  const [methods, setMethods] = useState([]);
  const [abi, setAbi] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading
    if (contractAddress) setLoading(true);
    // Fetch ABI
    const _fetchABI = async () => {
      let _abi = abiCache[contractAddress];

      // Fetch from chain block explorer
      if (!_abi) {
        const abiQuery = await fetch(
          chain.scanAbiUrl(contractAddress)
        ).then((response) => response.json());
        if (abiQuery.status === "1") {
          _abi = JSON.parse(abiQuery.result);
          // Cache results
          setAbiCache({
            ...abiCache,
            [contractAddress]: _abi
          })
        } else {
          if (
            abiQuery.result ===
            "Max rate limit reached, please use API Key for higher rate limit"
          ) {
            // If we have a no api error wait 5 seconds
            setTimeout(() => {
              _fetchABI();
            }, 5000);
          } else {
            setLoading(false);
          }
        }
      }

      if (_abi) {
        // Set the selected ABI
        setAbi(_abi);
        const _methods = [];
        await Promise.all(
          _abi.map((abiItem, i) => {
            if (!abiItem.constant && abiItem.type === "function") {
              _methods.push({
                name: abiItem.name,
                inputs: abiItem.inputs,
              });
            }
          })
        );
        setMethods(_methods);
        setLoading(false);
      }
    };
    if (contractAddress) _fetchABI();
  }, [contractAddress]);

  return [methods, abi, loading];
};
