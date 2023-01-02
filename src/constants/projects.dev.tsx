import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";
import { Project } from "../types";
import Chains from "./chains";

const Projects: Project[] = [
  {
    name: "kleros-goerli",
    icon: <KlerosLogo />,
    governorAddress: "0xea7CA2EcBC122dd12027ef19509c656080155E67",
    arbitratorAddress: "0x988b3a538b618c7a603e1c11ab82cd16dbe28069",
    snapshotSlug: "kleros",
    chain: Chains[5],
  }
]

export default Projects;