import React from "react";
import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";
import { ReactComponent as PohLogo } from "../assets/logos/poh.svg";

export default [
  {
    name: "kleros",
    icon: <KlerosLogo />,
    governorAddress: "0xe5bcea6f87aaee4a81f64dfdb4d30d400e0e5cf4",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: 'kleros'
  },
  {
    name: "Proof of Humanity",
    icon: <PohLogo/>,
    governorAddress: "0x327a29fcE0a6490E4236240Be176dAA282EcCfdF",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: 'poh.eth'
  }
];
