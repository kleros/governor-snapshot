import React from "react";
import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";
import { ReactComponent as PohLogo } from "../assets/logos/poh.svg";
import { ReactComponent as UbiLogo } from "../assets/logos/ubi.svg";

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
        icon: <PohLogo />,
        governorAddress: "0x327a29fcE0a6490E4236240Be176dAA282EcCfdF",
        arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
        snapshotSlug: 'poh.eth'
    },
    {
        name: "UBI",
        icon: <UbiLogo />,
        governorAddress: "0x7510c77163683448b8Dc8fe9e019d9482Be1ed2b",
        arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
        snapshotSlug: 'ubi-voting.eth'
    }
];
