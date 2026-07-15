import Web3 from "web3"

let web3: Web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" }).catch(() => { });
} else {
    // TODO catch error and show a better user message.
    throw new Error("Cannot load web3. Is Metamask installed?")
}

export default web3;
