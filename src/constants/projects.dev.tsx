import { ReactComponent as KlerosLogo } from "../assets/logos/kleros.svg";
import { Project } from "../types";
import Chains from "./chains";

const Projects: Project[] = [
  {
    name: "kleros-goerli",
    icon: <KlerosLogo />,
    governorAddress: "0xd74AB183e2B793A68cB3e647D8f4Df60936B59cA",
    arbitratorAddress: "0x1128eD55ab2d796fa92D2F8E1f336d745354a77A",
    snapshotSlug: "kleros",
    chain: Chains[5],
  }
]

export default Projects;