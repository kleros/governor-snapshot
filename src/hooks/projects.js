import { useState, useEffect } from "react";
import Projects from "../constants/projects";

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

export const useFetchMethodsForContract = (contractAddress) => {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const _fetchABI = async () => {
      const abiQuery = await fetch(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`
      ).then((response) => response.json());
      if (abiQuery.status === "1") {
        const _abi = JSON.parse(abiQuery.result);
        const _methods = [];
        await Promise.all(
          _abi.map((abiItem, i) => {
            if (!abiItem.constant && abiItem.type == "function") {
              _methods.push({
                name: abiItem.name,
                inputs: abiItem.inputs,
              });
            }
          })
        );
        setMethods(_methods);
      }
    };
    _fetchABI();
  }, [contractAddress]);

  return methods;
};
