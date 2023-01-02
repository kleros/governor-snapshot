import Web3 from "web3"

let web3: Web3;

if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
} else {
    // TODO catch error and show a better user message.
    throw new Error("Cannot load web3. Is Metamask installed?")
}

export default web3;
