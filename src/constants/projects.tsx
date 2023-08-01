import Chains from "./chains";
import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";
import { ReactComponent as PohLogo } from "../assets/logos/poh.svg";
import { ReactComponent as UbiLogo } from "../assets/logos/ubi.svg";
import { ReactComponent as ForkDAOLogo } from "../assets/logos/forkdao.svg";
import { Project } from "../types";

const Projects: Project[] = [
  {
    name: "kleros",
    icon: <KlerosLogo />,
    governorAddress: "0xe5bcea6f87aaee4a81f64dfdb4d30d400e0e5cf4",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: "kleros",
    chain: Chains[1],
  },
  {
    name: "Proof of Humanity",
    icon: <PohLogo />,
    governorAddress: "0x327a29fcE0a6490E4236240Be176dAA282EcCfdF",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: "poh.eth",
    chain: Chains[1],
  },
  {
    name: "UBI",
    icon: <UbiLogo />,
    governorAddress: "0x7510c77163683448b8Dc8fe9e019d9482Be1ed2b",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: "ubi-voting.eth",
    chain: Chains[1],
  },
  {
    name: "Fork DAO",
    icon: <ForkDAOLogo />,
    governorAddress: "0xf7dE5537eCD69a94695fcF4BCdBDeE6329b63322",
    arbitratorAddress: "0x9c1da9a04925bdfdedf0f6421bc7eea8305f9002",
    snapshotSlug: "fork-dao.eth",
    chain: Chains[100]
  }
]

export default Projects;
