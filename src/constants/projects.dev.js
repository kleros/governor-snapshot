import React from "react";
import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";

export default [
  {
    name: "kleros Mainnet",
    icon: <KlerosLogo />,
    governorAddress: "0xe5bcea6f87aaee4a81f64dfdb4d30d400e0e5cf4",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
  },
  {
    name: "kleros Goerli",
    icon: <KlerosLogo />,
    governorAddress: "0xea7CA2EcBC122dd12027ef19509c656080155E67",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
  },
  {
    name: "kleros Kovan",
    icon: <KlerosLogo />,
    governorAddress: "0x5355629eebb23b4b86a623f8d247b5fe44005613",
    arbitratorAddress: "0x60b2abfdfad9c0873242f59f2a8c32a3cc682f80",
  },
];
